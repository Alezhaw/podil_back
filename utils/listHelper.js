function getListFromArray(item) {
  let keys = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "aa",
    "ab",
    "ac",
    "ad",
    "ae",
    "af",
    "ag",
    "ah",
    "ai",
    "aj",
    "ak",
    "al",
    "am",
    "an",
    "ao",
  ];
  let itemObject = {};
  keys.map((el, index) => (itemObject[el] = item[index] || null));
  const list = {
    present: itemObject.a,
    present_status: itemObject.b && Number(itemObject.b),
    full_name: itemObject.c,
    coupon_number: itemObject.d,
    telephone: [itemObject.i, itemObject.j, itemObject.k].filter((el) => !!el),
    guests: itemObject.l && Number(itemObject.l),
    couples: itemObject.m && Number(itemObject.m),
    passport: itemObject.n && Number(itemObject.n),
    age: itemObject.o && Number(itemObject.o),
    instead: itemObject.p,
    guest_full_name: itemObject.q,
    client_with_bank_refusal: itemObject.r,
    guest_telephone: itemObject.ae,
    left_not_admitted: itemObject.af && Number(itemObject.af),
    reason: itemObject.ag,
    sms: itemObject.ah,
    notes: itemObject.ai,
    presentation_number: itemObject.aj && Number(itemObject.aj),
    location: itemObject.ak,
    time: itemObject.al,
    address: itemObject.am,
    team: itemObject.an && Number(itemObject.an),
    who_called: itemObject.ao,
  };

  return list;
}

class ListHelper {
  constructor() {}

  static convertToList(item) {
    return getListFromArray(item);
  }
}

module.exports = ListHelper;
