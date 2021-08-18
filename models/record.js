//Model finančního záznamu
class Record {
  constructor(
    id,
    name,
    comodityId,
    userId,
    date,
    note,
    category,
    price,
    priceType,
    sharedWith,
    shareStatus
  ) {
    this.id = id;
    this.name = name;
    this.comodityId = comodityId;
    this.userId = userId;
    this.date = date;
    this.note = note;
    this.category = category;
    this.price = price;
    this.priceType = priceType;
    this.sharedWith = sharedWith;
    this.shareStatus = shareStatus;
  }
}

export default Record;
