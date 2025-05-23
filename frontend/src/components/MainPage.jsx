import axios from "axios"
import { useState, useEffect, useRef } from 'react'
import { setTokensAndRole, getAccessToken, deleteTokensAndRole, getRefreshToken, getRole } from "../utils/token"
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { RiChatSmile3Line, RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineDone, MdOutlineDoneAll, MdOutlineModeEdit } from "react-icons/md";
import Pagination from "./Pagination"


const MainPage = ({ setLoggedIn }) => {
  const [isRefreshed, setIsRefreshed] = useState(false);

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [totalNumOfPages, setTotalNumOfPages] = useState(null);


  const [activeEditUserId, setActiveEditUserId] = useState(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [updateUsers, setUpdateUsers] = useState(false);

  const [alert, setAlert] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [displayModal, setDisplayModal] = useState(false);







  useEffect(() => {
    const refresh = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/v1/auth/refresh`,
          { refreshTk: getRefreshToken() },
          {
            // headers: {
            //   Authorization: `Bearer ${getAccessToken()}`
            // },
          }
        );


        setTokensAndRole(response.data.tokens.accessToken, response.data.tokens.refreshToken, response.data.role)
        setIsRefreshed(true);

        console.log("ref ok");

      } catch (err) {
        deleteTokensAndRole();
        setLoggedIn(false)

        console.error(err);
      }
    }

    refresh();
    const interval = setInterval(() => refresh(), 180000)  // 3 min
  }, []);



  useEffect(() => {

    if (isRefreshed) {
      const getUsers = async () => {
        try {

          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/v1/users?page=${currentPage}&limit=${limit}`,
            {
              headers: {
                Authorization: `Bearer ${getAccessToken()}`
              },
            }
          );


          setUsers(response.data.result)
          setTotalNumOfPages(response.data.totalPages)

          setUpdateUsers(false)

        } catch (err) {
          console.error(err);
        }
      }

      getUsers();
    }

  }, [isRefreshed, currentPage, updateUsers]);


  const handleEdit = (id, firstName, lastName, phone) => {
    setActiveEditUserId(id);


    setEditFirstName(firstName)
    setEditLastName(lastName)
    setEditPhone(phone)
  }


  const handleEditSubmit = (e) => {
    e.preventDefault();

    const updateUser = async () => {
      try {
        const inputs = {
          firstName: editFirstName,
          lastName: editLastName,
          phone: editPhone
        };

        const response = await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/v1/users/${activeEditUserId}`,
          inputs,
          {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`
            },
          }
        );


        setUpdateUsers(true)

        setActiveEditUserId(null)


      } catch (err) {
        console.error(err);
      }
    }

    updateUser();
  }



  const handleDelete = (id) => {

    const deleteUser = async () => {
      try {

        const response = await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/v1/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`
            },
          }
        );


        setUpdateUsers(true)


      } catch (err) {
        console.error(err);
      }
    }

    deleteUser();
  }


  useEffect(() => {
    if (alert) {

      setTimeout(() => {
        setAlert(null)
      }, 4000)
    }
  }, [alert]);



  const handleInvite = () => {
    setDisplayModal(true)
  }


  const handleInviteSubmit = (e) => {
    e.preventDefault();


    const sendInviteEmail = async () => {
      try {
        const inputs = {
          email: inviteEmail,
        };

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/v1/auth/register?fields=email`,
          inputs,
          {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`
            },
          }
        );


        setAlert({
          type: "green",
          message: "Email is sent"
        })

        setInviteEmail("")


      } catch (err) {
        console.error(err);
      }
    }

    sendInviteEmail();
  }







  if (getRole() === "admin") {
    return <>
      <button className="logout-btn" onClick={() => {
        deleteTokensAndRole()
        setLoggedIn(false)
      }}><IoIosLogOut /></button>

      {
        isRefreshed === false &&
        <div className="modal-loading">
          <div className="modal-content">
            Loading...
          </div>
        </div>
      }

      {
        displayModal &&
        <div className="modal-invite">
          <div className="modal-invite-content">
            <button className="btn-close-modal" onClick={() => {
              setDisplayModal(false)
            }}>X</button>
            <form onSubmit={handleInviteSubmit}>
              <div className="inputs-block">
                {
                  alert &&
                  <div className={`alert-text alert-text-${alert.type}`}>
                    {alert.message}
                  </div>
                }

                <div>
                  <label htmlFor="auth-email-input">
                    Email
                  </label>
                  <input
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    type="email"
                    id="auth-email-input"
                    required
                  />
                </div>

                <button type="submit">Send email link</button>
              </div>
            </form>
          </div>
        </div>
      }



      <section className="tools">
        <div className="container">
          <div className="tool-items">
            <button onClick={handleInvite}>Invite</button>
          </div>
        </div>
      </section>

      <section className="users">
        <div className="container">
          <div className="users-items">
            {
              users.map((el, index) => {

                if (el.isActive) {
                  return <div className="user-block" key={index}>
                    <div>
                      <img crossOrigin="anonymous" src={el.imgUrl} alt="avatar" />
                    </div>
                    <div className="user-content">
                      {
                        activeEditUserId === el._id ?
                          <>
                            <form onSubmit={handleEditSubmit}>
                              <div className="user-content-item first-name">
                                First name:
                                <input className="edit-input" type="text" value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} />
                              </div>
                              <div className="user-content-item last-name">
                                Last name:
                                <input className="edit-input" type="text" value={editLastName} onChange={(e) => setEditLastName(e.target.value)} />
                              </div>
                              <div className="user-content-item email">
                                Email: <span>{el.email}</span>
                              </div>
                              <div className="user-content-item phone">
                                Phone:
                                <input className="edit-input" type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                              </div>

                              <div className="buttons">
                                <button type="submit" className="save">Save</button>
                              </div>
                            </form>
                          </>
                          :
                          <>
                            <div className="user-content-item first-name">
                              First name: <span>{el.firstName}</span>
                            </div>
                            <div className="user-content-item last-name">
                              Last name: <span>{el.lastName}</span>
                            </div>
                            <div className="user-content-item email">
                              Email: <span>{el.email}</span>
                            </div>
                            <div className="user-content-item phone">
                              Phone: <span>{el.phone}</span>
                            </div>

                            <div className="buttons">
                              <button className="edit" onClick={() => handleEdit(el._id, el.firstName, el.lastName, el.phone)}><MdOutlineModeEdit /></button>
                              <button className="delete" onClick={() => handleDelete(el._id)}><RiDeleteBin5Line /></button>
                            </div>
                          </>
                      }
                    </div>
                  </div>
                }
              })
            }
          </div>
          <Pagination
            totalNumOfPages={totalNumOfPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            limit={limit}
          />
        </div>
      </section>
    </>


  } else if (getRole() === "regularUser") {

    return <>
      <button className="logout-btn" onClick={() => {
        deleteTokensAndRole()
        setLoggedIn(false)
      }}><IoIosLogOut /></button>

      {
        isRefreshed === false &&
        <div className="modal-loading">
          <div className="modal-content">
            Loading...
          </div>
        </div>
      }



      <section className="users">
        <div className="container">
          <div className="users-items">
            {
              users.map((el, index) => {

                return <div className="user-block" key={index}>
                  <div>
                    <img crossOrigin="anonymous" src={el.imgUrl} alt="avatar" />
                  </div>
                  <div className="user-content">
                    <div className="user-content-item first-name">
                      First name: <span>{el.firstName}</span>
                    </div>
                    <div className="user-content-item last-name">
                      Last name: <span>{el.lastName}</span>
                    </div>
                    <div className="user-content-item email">
                      Email: <span>{el.email}</span>
                    </div>
                  </div>
                </div>
              })
            }
          </div>
          <Pagination
            totalNumOfPages={totalNumOfPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            limit={limit}
          />
        </div>
      </section>
    </>
  }



};

export default MainPage;