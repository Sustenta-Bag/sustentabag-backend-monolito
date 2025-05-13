import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import admin from "firebase-admin";
import AppError from "../../infrastructure/errors/AppError.js";

class FirebaseService {  constructor() {
    try {
      console.log("Firebase config check:", {
        apiKey: process.env.FIREBASE_API_KEY ? "Definido" : "Não definido",
        authDomain: process.env.FIREBASE_AUTH_DOMAIN ? "Definido" : "Não definido",
        projectId: process.env.FIREBASE_PROJECT_ID ? "Definido" : "Não definido",
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET ? "Definido" : "Não definido",
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ? "Definido" : "Não definido",
        appId: process.env.FIREBASE_APP_ID ? "Definido" : "Não definido"
      });
      
      const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      };
      
      if (!firebaseConfig.apiKey) {
        console.error("Erro crítico: FIREBASE_API_KEY não encontrada nas variáveis de ambiente");
        throw new Error("Firebase API Key não configurada");
      }

      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      console.log("Firebase Auth SDK inicializado com sucesso");
    } catch (error) {
      console.error("Erro ao inicializar Firebase Auth SDK:", error);
      this.authInitialized = false;
      return;
    }
    
    this.authInitialized = true;

    if (!admin.apps.length) {
      try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
          : undefined;

        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
          }),
        });

        console.log(
          "Firebase Admin SDK inicializado com sucesso usando variáveis individuais"
        );
      } catch (error) {
        console.error("Erro ao inicializar Firebase Admin SDK:", error);
        console.error("Detalhes da configuração:", {
          projectId: process.env.FIREBASE_PROJECT_ID
            ? "Definido"
            : "Não definido",
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
            ? "Definido"
            : "Não definido",
          privateKeyExists: !!process.env.FIREBASE_PRIVATE_KEY,
        });
      }
    }
  }
  async createUser(userData) {
    if (!this.authInitialized) {
      console.warn("Firebase Auth não foi inicializado. Criação de usuário Firebase não disponível.");
      return null;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password
      );

      try {
        if (!admin.apps.length) {
          console.warn(
            "Admin SDK não inicializado, pulando operação Firestore"
          );
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
            localId: null,
          });
        console.log("Dados armazenados com sucesso no Firestore");
      } catch (firestoreError) {
        console.error(
          "Erro ao salvar no Firestore, mas usuário Auth foi criado:",
          firestoreError
        );
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
        console.warn(
          "Admin SDK não inicializado, pulando atualização do ID local"
        );
        return false;
      }

      const docRef = admin.firestore().collection("users").doc(firebaseUid);
      await docRef.get();

      await docRef.update({
        localId: localId,
      });

      return true;
    } catch (error) {
      console.error("Erro ao atualizar ID local no Firestore:", error);
      return false;
    }
  }


  async verifyIdToken(idToken) {
    try {
      if (!admin.apps.length) {
        throw new Error("Admin SDK not initialized");
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error("Error verifying Firebase token:", error);
      throw new AppError(
        "Token Firebase inválido",
        "INVALID_FIREBASE_TOKEN",
        401
      );
    }
  }

  async updateUserPassword(uid, newPassword) {
    try {
      if (!admin.apps.length) {
        throw new Error("Admin SDK not initialized");
      }

      await admin.auth().updateUser(uid, {
        password: newPassword,
      });

      return true;
    } catch (error) {
      console.error("Error updating Firebase password:", error);
      throw new AppError(
        "Erro ao atualizar senha no Firebase",
        "FIREBASE_PASSWORD_UPDATE_ERROR"
      );
    }
  }

  async updateUserFcmToken(firebaseUid, fcmToken) {
  try {
    if (!admin.apps.length) {
      console.warn("Admin SDK não inicializado, pulando atualização do token FCM");
      return false;
    }

    const docRef = admin.firestore().collection("users").doc(firebaseUid);
    await docRef.update({
      fcmToken: fcmToken,
      lastTokenUpdate: admin.firestore.FieldValue.serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error("Erro ao atualizar token FCM no Firestore:", error);
    return false;
  }
}
}

export default FirebaseService;
