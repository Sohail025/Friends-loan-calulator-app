import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
export default function App() {
  const [showNewForm, SetshowNewForm] = useState(false);
  const [selectedFriend, SetSelectedFriend] = useState(null);
  const [friend, Setfriend] = useState(initialFriends);
  return (
    <div className="app">
      <div className="sidebar">
        <Friendslist
          friend={friend}
          key={friend.id}
          SelectionHandler={SelectionHandler}
          selectedFriend={selectedFriend}
        />
        {showNewForm && <AddFormFriend SetfriendHandler={SetfriendHandler} />}
        <br></br>
        <Button change={handlershownewFrom}>
          {showNewForm ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <SplitBillForm selectedFriend={selectedFriend} SplitBill={SplitBill} />
      )}
    </div>
  );
  function handlershownewFrom() {
    SetshowNewForm((show) => !show);
  }
  function SetfriendHandler(friend) {
    Setfriend((friends) => [...friends, friend]);
    SetshowNewForm(false);
  }
  function SelectionHandler(friend) {
    SetSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
  }
  function SplitBill(value) {
    friend.map((friend) =>
      friend.id === selectedFriend.id
        ? { ...friend, balance: (friend.balance = value) }
        : friend
    );
    SetSelectedFriend(null);
  }
}
function Friendslist({ friend, SelectionHandler, selectedFriend }) {
  return (
    <ul>
      {friend.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          SelectionHandler={SelectionHandler}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, SelectionHandler, selectedFriend }) {
  const isSelected = selectedFriend === friend;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 ? (
        <p className="red">
          You owes {friend.name} {Math.abs(friend.balance)}
        </p>
      ) : friend.balance > 0 ? (
        <p className="green">
          {friend.name} ows You {friend.balance}
        </p>
      ) : (
        <p>You and {friend.name} are even</p>
      )}
      <Button change={() => SelectionHandler(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function Button({ children, change }) {
  return (
    <button onClick={change} className="button">
      {children}
    </button>
  );
}
function AddFormFriend({ SetfriendHandler }) {
  const [name, Setname] = useState("");
  const [image, Setimage] = useState("https://i.pravatar.cc/48");
  function handleNewForm(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    SetfriendHandler(newFriend);
    Setname("");
    Setimage("https://i.pravatar.cc/48");
    console.log(newFriend);
  }
  return (
    <form className="add-form-friend" onSubmit={handleNewForm}>
      <label className="label">Friend Name</label>
      <input
        value={name}
        onChange={(e) => Setname(e.target.value)}
        type="text"
      ></input>
      <label>Image Url</label>
      <input
        value={image}
        onChange={(e) => Setimage(e.target.value)}
        type="text"
      ></input>
      <Button>Add</Button>
    </form>
  );
}
function SplitBillForm({ selectedFriend, SplitBill }) {
  const [bill, setBill] = useState("");
  const [billbyUser, setBillbyUser] = useState("");
  const [payingBill, SetpayingBill] = useState("User");
  const friendbill = Number(bill) ? Number(bill - billbyUser) : "";
  return (
    <form className="form-split-bill">
      <h2>SPLIT A BILL WITH {selectedFriend.name}</h2>
      <label>Bill Value</label>
      <input
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        type="text"
      ></input>
      <label>Your expense</label>
      <input
        value={billbyUser}
        onChange={(e) =>
          setBillbyUser(
            Number(e.target.value) > Number(bill)
              ? Number(billbyUser)
              : Number(e.target.value)
          )
        }
        type="text"
      ></input>
      <label>{selectedFriend.name} Expence</label>
      <input value={friendbill} type="text" disabled></input>
      <label>Who is paying the bill</label>
      <select
        value={payingBill}
        onChange={(e) => SetpayingBill(e.target.value)}
      >
        <option value={"frined"}>{selectedFriend.name}</option>
        <option value={"User"}>You</option>
      </select>
      <Button change={balanceHandler}>Split Bill</Button>
    </form>
  );
  function balanceHandler(e) {
    selectedFriend.balance = Number(bill);
    e.preventDefault();
    if (!bill || !billbyUser) return;
    SplitBill(payingBill === "User" ? friendbill : -billbyUser);
    setBill("");
    setBillbyUser("");
  }
}
