//Model nemovitosti
class Comodity {
  constructor(id, wardenId, tenantId, name, address, description, currency) {
    this.id = id;
    this.wardenId = wardenId;
    this.tenantId = tenantId;
    this.name = name;
    this.address = address;
    this.description = description;
    this.currency = currency;
  }
}

export default Comodity;
