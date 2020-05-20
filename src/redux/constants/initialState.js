export const initialState = {
  tournament: {
    title: "",
    date: "2020-10-20",
    time: "10:00",
    venue: "",
    inOrOut: "",
    courts: 1,
    gender: "Mixed",
    minAge: 0,
    skill: [0, 6],
    type: "Modified",
    fee: 0,
    open: "2020-09-20",
    deadline: "2020-10-15",
    contact: "",
    organizer: "",
    details: "",
    participants: [],
  },
  tournaments: [],
  account: {
    name: "",
    email: "",
    phone: "+1",
    zipcode: "",
    birthdate: "1990-01-15",
    skill: 0,
    gender: "",
  },
  ids: [],
};
