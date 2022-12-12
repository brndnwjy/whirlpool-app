import React, { useEffect, useState } from "react";
import axios from "axios";
import ClickAwayListener from "react-click-away-listener";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

import menu from "../../assets/menu.svg";
import searchicon from "../../assets/search.svg";
import logo from "../../assets/splash.svg";
import avatar from "../../assets/dummy.jpg";
import profile from "../../assets/profile.svg";
import logout from "../../assets/setting.svg";
// import fbtn from "../../assets/friend-btn.svg";
import plus from "../../assets/plus.svg";
import send from "../../assets/send.png";
import back from "../../assets/back.svg";

import styles from "./main.module.css";

const Main = ({ socket }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friend, setFriend] = useState({});

  const [popup, setPopup] = useState(false);
  const [chatActive, setChatActive] = useState(false);
  const [myProfile, setMyProfile] = useState(false);
  const [friendProfile, setFriendProfile] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState();
  const [photo, setPhoto] = useState();
  const [preview, setPreview] = useState();

  const [isLogout, setIsLogout] = useState(false);

  useEffect(() => {
    const { id } = JSON.parse(localStorage.getItem("user"));
    axios
      .get(`https://whirlpool-arx.up.railway.app/v1/user/${id}`)
      .then((res) => {
        const user = res.data.data;
        setUser(user);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`https://whirlpool-arx.up.railway.app/v1/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        const data = res.data.data;
        setFriends(data);
      });
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("private-msg-BE", (message) => {
        setMessages((current) => [...current, message]);
      });
    }
  }, [socket]);

  useEffect(() => {
    setMessages([]);
    const token = localStorage.getItem("token");
    axios
      .get(`https://whirlpool-arx.up.railway.app/v1/chat/${friend.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const result = res.data.data;
        setMessages(result);
      });
  }, [friend]);

  const selectFriend = (friend) => {
    setFriend(friend);
    setChatActive(true);
    setFriendProfile(false);
  };

  const handleInput = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => {
    setPhoto(e.target.files[0]);
    setPreview([URL.createObjectURL(e.target.files[0])]);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    if (editForm.fullname) {
      formData.append("fullname", editForm.fullname);
    }
    if (editForm.phone) {
      formData.append("phone", editForm.phone);
    }
    if (editForm.username) {
      formData.append("username", editForm.username);
    }
    if (editForm.bio) {
      formData.append("bio", editForm.bio);
    }
    if (photo) {
      formData.append("avatar", photo);
    }

    await axios
      .put(
        `https://whirlpool-arx.up.railway.app/v1/user/${user.user_id}`,
        formData
      )
      .then((res) => {
        // alert("berhasil update")
        swal({
          title: "Account Updated",
          text: `You have just updated your account`,
          icon: "success",
        });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    setEditMode(false);
    navigate("/");
  };

  const handleChat = (e) => {
    setMessage(e.target.value);
  };

  const handleMessage = () => {
    console.log(messages);
    if (socket && message && friend.user_id) {
      socket.emit(
        "private-msg",
        {
          receiver: friend.user_id,
          msg: message,
        },
        (message) => {
          setMessages((current) => [...current, message]);
        }
      );
      setMessage("");
    } else {
      alert("Error");
    }
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      if (socket && message && friend.user_id) {
        socket.emit(
          "private-msg",
          {
            receiver: friend.user_id,
            msg: message,
          },
          (message) => {
            setMessages((current) => [...current, message]);
          }
        );
        setMessage("");
      } else {
        alert("Error");
      }
    }
  };

  const handleLogout = () => {
    swal({
      title: "Logging Out",
      text: `Are you sure want to leave?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (confirm) => {
      if (confirm) {
        axios.put(
          `https://whirlpool-arx.up.railway.app/v1/user/offline/${user.user_id}`
        );
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("persist:data");

        setIsLogout(true);
      }
    });
  };

  useEffect(() => {
    if (isLogout) {
      swal({
        title: "Logged Out",
        text: `You have been logged out`,
        icon: "success",
      });
      navigate("/login");
    }
  }, [isLogout, navigate]);

  return (
    <body className={styles.body}>
      {myProfile ? (
        <aside className={`col-3 ${styles.profile}`}>
          <button
            onClick={() => {
              setMyProfile(false);
              setPopup(false);
              setEditMode(false);
              setEditForm();
              setPreview();
            }}
            className={styles["back-btn"]}
          >
            <img src={back} alt="" />
          </button>

          <div className={styles["profile-top"]}>
            {editMode ? (
              <>
                <img
                  src={preview ? preview : user.avatar ? user.avatar : avatar}
                  alt=""
                />
                <label htmlFor="photo" className={styles["avatar-btn"]}>
                  Sunting
                </label>
                <input
                  onChange={handleFile}
                  id="photo"
                  name="photo"
                  type="file"
                  hidden
                />
                <input
                  onChange={handleInput}
                  type="text"
                  id="fullname"
                  name="fullname"
                  placeholder={user.fullname}
                  className={styles["name-input"]}
                />
              </>
            ) : (
              <>
                <img src={user.avatar ? user.avatar : avatar} alt="" />
                <h4>{user.fullname}</h4>
              </>
            )}
          </div>

          <form className="w-100 m-0">
            <div className={styles["profile-info"]}>
              <h5 className="mb-3">Account</h5>
              {editMode ? (
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder={user.phone}
                  onChange={handleInput}
                />
              ) : (
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={user.phone}
                  disabled
                />
              )}
              <small>phone number</small>
              <hr className="my-3" />
              {editMode ? (
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder={user.username ? user.username : "Not set"}
                  onChange={handleInput}
                />
              ) : (
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={user.username ? user.username : "Not set"}
                  disabled
                />
              )}

              <small>username</small>
              <hr className="my-3" />
              {editMode ? (
                <input
                  type="text"
                  name="bio"
                  id="bio"
                  placeholder={user.bio ? user.bio : "I'm using Whirlpool"}
                  onChange={handleInput}
                />
              ) : (
                <input
                  type="text"
                  name="bio"
                  id="bio"
                  value={user.bio ? user.bio : "I'm using Whirlpool"}
                  disabled
                />
              )}
              <small>Bio</small>
            </div>

            <div className={styles.options}>
              {editMode ? (
                <>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className={`mb-3 ${styles["edit-btn"]}`}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className={styles["delete-btn"]}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className={`mb-3 ${styles["edit-btn"]}`}
                  >
                    Edit
                  </button>
                  <button type="button" className={styles["delete-btn"]}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </form>
        </aside>
      ) : (
        <aside className={`col-3 ${styles.sidemenu}`}>
          <div className={`col-12 mb-3 ${styles.sideheader}`}>
            <h2>Whirlpool</h2>
            <button onClick={() => setPopup(true)}>
              <img src={menu} alt="" />
            </button>
          </div>

          {popup && (
            <ClickAwayListener onClickAway={() => setPopup(false)}>
              <div className={styles.popmenu}>
                <div
                  onClick={() => {
                    setMyProfile(true);
                  }}
                  className={styles.popitem}
                >
                  <img src={profile} alt="" />
                  <h6>Profile</h6>
                </div>

                <div onClick={handleLogout} className={styles.popitem}>
                  <img src={logout} alt="" />
                  <h6>Log Out</h6>
                </div>
              </div>
            </ClickAwayListener>
          )}

          <div className={`col-12 mb-3 ${styles.searchbar}`}>
            <img src={searchicon} alt="" />
            <input placeholder="Search..." />
          </div>

          <section className={`col-12 ${styles["chat-list"]}`}>
            {friends &&
              friends.map((item) => (
                <div
                  onClick={() => selectFriend(item)}
                  className={`col-12 ${styles["chat-bubble"]}`}
                >
                  <img src={item.avatar ? item.avatar : avatar} alt="" />
                  <div className={styles["chat-info"]}>
                    <h6>{item.fullname ? item.fullname : "Nama Teman"}</h6>
                    <small>Tekan untuk membuka chat</small>
                  </div>
                </div>
              ))}
          </section>
        </aside>
      )}

      {!chatActive ? (
        <main className={`col-9 ${styles.main}`}>
          <div className={styles.landing}>
            <img src={logo} alt="" />
            <h1>Whirlpool Chat</h1>
            <h4>Choose a friend to start messaging!</h4>
          </div>
        </main>
      ) : (
        <main
          className={
            friendProfile
              ? `col-6 ${styles.chatroom}`
              : `col-9 ${styles.chatroom}`
          }
        >
          <header className={styles.chatheader}>
            <img
              onClick={() => setFriendProfile(true)}
              src={friend.avatar ? friend.avatar : avatar}
              alt=""
            />
            <div className={styles["friend-header"]}>
              <h4 onClick={() => setFriendProfile(true)}>
                {friend.fullname ? friend.fullname : "Nama Teman"}
              </h4>
              <h6>{friend.status === 0 ? "Offline" : "Online"}</h6>
            </div>
          </header>

          <section className={styles.chatbody}>
            {messages &&
              messages.map((item) =>
                user.user_id === item.sender ? (
                  <p className={styles["chat-right"]}>
                    <sub>
                      {item.created_at
                        ? `${new Date(item.created_at).getHours()}:${new Date(
                            item.created_at
                          ).getMinutes()}`
                        : item.date}{" "}
                    </sub>
                    {item.message}
                  </p>
                ) : (
                  <p className={styles["chat-left"]}>
                    {item.message}
                    <sub>
                      {item.created_at
                        ? `${new Date(item.created_at).getHours()}:${new Date(
                            item.created_at
                          ).getMinutes()}`
                        : `${new Date(item.date).getHours()}:${new Date(
                            item.date
                          ).getMinutes()}`}{" "}
                    </sub>
                  </p>
                )
              )}
          </section>

          <div className={styles.chatfooter}>
            <div className={styles.chatbox}>
              <input
                placeholder="Type a message..."
                type="text"
                value={message}
                onChange={handleChat}
                onKeyDown={handleEnterKey}
              />
              <label htmlFor="fileinput" className={styles["file-btn"]}>
                <img src={plus} alt="" />
              </label>
              <input id="fileinput" name="fileinput" type="file" hidden />
              <button onClick={handleMessage} className={styles["send-btn"]}>
                <img src={send} alt="" />
              </button>
            </div>
          </div>
        </main>
      )}

      {friendProfile && (
        <main className={`col-3 ${styles["friend-profile"]}`}>
          <button
            onClick={() => setFriendProfile(false)}
            className={styles["back-btn"]}
          >
            <img src={back} alt="" />
          </button>

          <div className={styles["profile-top"]}>
            <img src={friend.avatar ? friend.avatar : avatar} alt="" />
            <h4>{friend.fullname}</h4>
          </div>

          <div className={styles["profile-info"]}>
            <h5 className="mb-3">Info</h5>
            <p>{friend.phone}</p>
            <small>phone number</small>
            <hr className="my-3" />
            <p>{friend.username ? `@${friend.username}` : "Not set"}</p>
            <small>username</small>
            <hr className="my-3" />
            <p>{friend.bio ? friend.bio : "I'm using Whirlpool"}</p>
            <small>Bio</small>
          </div>
        </main>
      )}

      {/* -------------------- Sidemenu v1 -------------------- */}
      {/* <aside className={`col-3 ${styles.sidemenu}`}>
        <div className={`col-12 mb-3 ${styles.sideheader}`}>
          <h2>Whirlpool</h2>
          <button onClick={() => setPopup(true)}>
            <img src={menu} alt="" />
          </button>
        </div>

        {popup && (
          <ClickAwayListener onClickAway={() => setPopup(false)}>
            <div className={styles.popmenu}>
              <div
                onClick={() => {
                  setMyProfile(true);
                }}
                className={styles.popitem}
              >
                <img src={profile} alt="" />
                <h6>Profile</h6>
              </div>

              <div className={styles.popitem}>
                <img src={logout} alt="" />
                <h6>Log Out</h6>
              </div>
            </div>
          </ClickAwayListener>
        )}

        <div className={`col-12 mb-3 ${styles.searchbar}`}>
          <img src={searchicon} alt="" />
          <input placeholder="Search..." />
        </div>

        <section className={`col-12 ${styles["chat-list"]}`}>
          {friends &&
            friends.map((item) => (
              <div
                onClick={() => selectFriend(item)}
                className={`col-12 ${styles["chat-bubble"]}`}
              >
                <img src={avatar} alt="" />
                <div className={styles["chat-info"]}>
                  <h6>{item.fullname ? item.fullname : "Nama Teman"}</h6>
                  <small>Tekan untuk membuka chat</small>
                </div>
              </div>
            ))}
        </section>
      </aside> */}

      {/* -------------------- Sidemenu v2 -------------------- */}
      {/* <aside className={`col-3 ${styles.profile}`}>
        <button
          onClick={() => setMyProfile(false)}
          className={styles["back-btn"]}
        >
          <img src={back} alt="" />
        </button>

        <div className={styles["profile-top"]}>
          <img src={avatar} alt="" />
          <h4>Nama user</h4>
        </div>

        <form className="w-100 m-0">
          <div className={styles["profile-info"]}>
            <h5 className="mb-3">Account</h5>
            <input
              type="tel"
              name="phone"
              id="phone"
              value="Your number here"
              disabled
            />
            <small>phone number</small>
            <hr className="my-3" />
            <input
              type="text"
              name="username"
              id="username"
              value="Your username here"
              disabled
            />
            <small>username</small>
            <hr className="my-3" />
            <input
              type="text"
              name="bio"
              id="bio"
              value="Your bio here"
              disabled
            />
            <small>Bio</small>
          </div>

          <div className={styles.options}>
            <button className={`mb-3 ${styles["edit-btn"]}`}>Edit</button>
            <button className={styles["delete-btn"]}>Delete</button>
          </div>
        </form>
      </aside> */}

      {/* -------------------- Main v1 -------------------- */}
      {/* <main className={`col-9 ${styles.main}`}>
        <div className={styles.landing}>
          <img src={logo} alt="" />
          <h1>Whirlpool Chat</h1>
          <h4>Choose a friend to start messaging!</h4>
        </div>
      </main> */}

      {/* -------------------- Main v2 -------------------- */}
      {/* <main className={`col-9 ${styles.chatroom}`}>
        <header className={styles.chatheader}>
          <img src={avatar} alt="" />
          <div className={styles["friend-header"]}>
            <h4>{friend.fullname ? friend.fullname : "Nama Teman"}</h4>
            <h6>Offline</h6>
          </div>
        </header>

        <section className={styles.chatbody}>
          {messages &&
            messages.map((item) =>
              user.id === item.sender ? (
                <p className={styles["chat-right"]}>
                  <sub>
                    {item.created_at
                      ? `${new Date(item.created_at).getHours()}:${new Date(
                          item.created_at
                        ).getMinutes()}`
                      : item.date}{" "}
                  </sub>
                  {item.message}
                </p>
              ) : (
                <p className={styles["chat-left"]}>
                  {item.message}
                  <sub>
                    {new Date(item.created_at).getHours()}:
                    {new Date(item.created_at).getMinutes()}
                  </sub>
                </p>
              )
            )}
        </section>

        <div className={styles.chatfooter}>
          <div className={styles.chatbox}>
            <input
              placeholder="Type a message..."
              type="text"
              value={message}
              onChange={handleInput}
            />
            <label htmlFor="fileinput" className={styles["file-btn"]}>
              <img src={plus} alt="" />
            </label>
            <input id="fileinput" name="fileinput" type="file" hidden />
            <button onClick={handleMessage} className={styles["send-btn"]}>
              <img src={send} alt="" />
            </button>
          </div>
        </div>
      </main> */}

      {/* -------------------- Main v3 -------------------- */}
      {/* <main className={`col-3 ${styles['friend-profile']}`}>
        <button className={styles["back-btn"]}>
          <img src={back} alt="" />
        </button>

        <div className={styles["profile-top"]}>
          <img src={avatar} alt=""/>
          <h4>Nama user</h4>
        </div>

        <div className={styles["profile-info"]}>
          <h5 className="mb-3">Info</h5>
          <p>their phone number here</p>
          <small>phone number</small>
          <hr className="my-3" />
          <p>their username here</p>
          <small>username</small>
          <hr className="my-3" />
          <p>their bio here</p>
          <small>Bio</small>
        </div>
      </main> */}
    </body>
  );
};

export default Main;
