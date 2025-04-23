import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import admin from "firebase-admin";
import AppError from "../../infrastructure/errors/AppError.js";
import fs from 'fs';
import path from 'path';

class FirebaseService {
  constructor() {
    // Configuração para o Firebase Client SDK
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };

    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);

    if (!admin.apps.length) {
      try {
        const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        
        if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccountPath)
          });
          console.log('Firebase Admin SDK inicializado com arquivo de credenciais');
        } else {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
            }),
          });
          console.log('Firebase Admin SDK inicializado com variáveis de ambiente');
        }
      } catch (error) {
        console.error('Erro ao inicializar Firebase Admin SDK:', error);
      }
    }
  }

  async createUser(userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password
      );

      try {
        if (!admin.apps.length) {
          console.warn('Admin SDK não inicializado, pulando operação Firestore');
          return { uid: userCredential.user.uid };
        }

        await admin
          .firestore()
          .collection("users")
          .doc(userCredential.user.uid)
          .set({
            name: userData.name,
            email: userData.email,
            cpf: userData.cpf,
            phone: userData.phone,
            status: userData.status || 1,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            localId: null
          });
        console.log('Dados armazenados com sucesso no Firestore');
      } catch (firestoreError) {
        console.error('Erro ao salvar no Firestore, mas usuário Auth foi criado:', firestoreError);
      }

      return {
        uid: userCredential.user.uid,
      };
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        throw new AppError(
          "Email já cadastrado no Firebase",
          "EMAIL_ALREADY_EXISTS_FIREBASE"
        );
      }
      throw new AppError(
        `Erro ao criar usuário no Firebase: ${error.message}`,
        "FIREBASE_ERROR"
      );
    }
  }

  async updateLocalIdInFirestore(firebaseUid, localId) {
    try {
      if (!admin.apps.length) {
        console.warn('Admin SDK não inicializado, pulando atualização do ID local');
        return false;
      }

      await admin
        .firestore()
        .collection("users")
        .doc(firebaseUid)
        .update({
          localId: localId
        });
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar ID local no Firestore:", error);
      return false;
    }
  }
}

export default FirebaseService;