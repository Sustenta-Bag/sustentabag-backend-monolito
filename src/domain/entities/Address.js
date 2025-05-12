class Address {
  constructor(id, zipCode, state, city, street, number, complement, latitude = null, longitude = null, status = 1, createdAt = new Date()) {
    this.id = id;
    this.zipCode = zipCode;
    this.state = state; 
    this.city = city;
    this.street = street;
    this.number = number;
    this.complement = complement;
    this.latitude = latitude;
    this.longitude = longitude;
    this.status = status;
    this.createdAt = createdAt;
  }
  
  updateStatus(newStatus) {
      this.status = newStatus;
      return this;
  }

  updateZipCode(newZipCode) {
      this.zipCode = newZipCode;
      return this;
  }

  updateState(newState) {
      this.state = newState;
      return this;
  }

  updateCity(newCity) {
      this.city = newCity;
      return this;
  }

  updateStreet(newStreet) {
      this.street = newStreet;
      return this;
  }

  updateNumber(newNumber) {
      this.number = newNumber;
      return this;
  }
  updateComplement(newComplement) {
      this.complement = newComplement;
      return this;
  }

  updateCoordinates(latitude, longitude) {
      this.latitude = latitude;
      this.longitude = longitude;
      return this;
  }

  deactivate() {
      this.status = 0;
      return this;
  }

  activate() {
      this.status = 1;
      return this;
  }
}

export default Address;