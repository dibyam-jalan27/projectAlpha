import React, { useEffect, useState } from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { MailOutline, PermIdentity } from "@mui/icons-material";
import { Card } from "@mui/material";
import { Chart } from "react-google-charts";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDateTime } from "../../utils";
import "./dashboard.css";

const CustomCard = ({ child }) => {
  return (
    <Card
      sx={{
        width: 650,
        height: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {child}
    </Card>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [problemDifficulties, setProblemDifficulties] = useState([]);
  const [tags, setTags] = useState([]);
  const [loader, setLoader] = useState(false);
  const [hasData, setHasData] = useState(false);
  

  useEffect(() => {
    axios
      .get(`/api/v1/me`)
      .then((res) => {
        setUser(res.data.user);

        if (res.data != null) {
          const userTags = res.data.user.verdicts.tags;
          let tags_ = [["Tags", "Count"]];

          Object.keys(userTags).forEach((curTag) => {
            tags_.push([curTag, userTags[curTag]]);
          });

          setTags(tags_);
        }
      })
      .catch((err) => {
        const error = err.response ? err.response.data.message : err.message;
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  }, []);

  useEffect(() => {
    if (user && user.verdicts && user.difficulty) {
      let _submissions = [["Field", "Count"]],
        _problemDifficulties = [["Field", "Count"]];

      let _hasData = false;

      Object.keys(user.verdicts).forEach((keyName) => {
        if (keyName !== "tags") {
          _hasData |= user.verdicts[keyName] !== 0;
          _submissions.push([keyName, user.verdicts[keyName]]);
        }
      });

      Object.keys(user.difficulty).forEach((keyName) => {
        _hasData |= user.difficulty[keyName] !== 0;
        _problemDifficulties.push([
          keyName.charAt(0).toUpperCase() + keyName.toLowerCase().slice(1),
          user.difficulty[keyName],
        ]);
      });

      setSubmissions(_submissions);
      setProblemDifficulties(_problemDifficulties);
      setHasData(_hasData);
      setLoader(false);
    }
  }, [user]);
  return (
    <>
      <div className="dashboard-container">
        <ToastContainer />
        <div className="dashboard-spinner">
          <BeatLoader color={"#343a40"} size={30} loading={loader} />
        </div>
        <div className="dashboard-left">
          <div className="dashboard-top">
            <img
              src="https://images.unsplash.com/photo-1513789181297-6f2ec112c0bc?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aGFja2VyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              alt=""
              className="dashboard-image"
            />
            <div className="dashboard-top-title">
              <span className="dashboard-username">{user.name}</span>
              <span className="dashboard-user-title">
                Competitive Programmer
              </span>
            </div>
          </div>
          <div className="dashboard-bottom">
            <span className="dashboard-content-title">Account Details</span>
            <div className="dashboard-info">
              <PermIdentity className="dashboard-icon" />
              <span className="dashboard-info-title">print("Hello World")</span>
            </div>
            <div className="dashboard-info">
              <CalendarTodayIcon className="dashboard-icon" />
              <span className="dashboard-info-title">
                Registered: {getDateTime(user.createdAt)}
              </span>
            </div>
            <span className="dashboard-content-title">Contact Details</span>

            <div className="dashboard-info">
              <MailOutline className="dashboard-icon" />
              <span className="dashboard-info-title">{user.email}</span>
            </div>
          </div>
        </div>
        <div className="dashboard-right">
          <div className="dashboard-top-right">
            {hasData ? (
              <Chart
                width="900px"
                height="550px"
                chartType="PieChart"
                loader={
                  <CustomCard child={<CircularProgress color="secondary" />} />
                }
                data={tags}
                options={{
                  title: "Tags of " + user.name,
                  pieHole: 0,
                  titleTextStyle: {
                    fontSize: 20,
                  },
                }}
                rootProps={{ "data-testid": "3" }}
              />
            ) : (
              <div className="dashboard-chart-no-data">
                <p className="dashboard-chart-no-data-title">
                  You have not submitted anything yet.
                </p>
              </div>
            )}
          </div>
          {hasData !== 0 && (
          <div className="dashboard-bottom-right">
            <Chart
              width={"500px"}
              height={"300px"}
              chartType="PieChart"
              loader={
                <CustomCard child={<CircularProgress color="secondary" />} />
              }
              data={submissions}
              options={{
                title: "Verdicts of " + user.name,
                is3D: true,
                titleTextStyle: {
                  fontSize: 20,
                },
              }}
              rootProps={{ "data-testid": "2" }}
            />
            <Chart
              width={"500px"}
              height={"300px"}
              chartType="PieChart"
              loader={
                <CustomCard child={<CircularProgress color="secondary" />} />
              }
              data={problemDifficulties}
              options={{
                title: "Levels of " + user.name,
                is3D: true,
                titleTextStyle: {
                  fontSize: 20,
                },
              }}
              rootProps={{ "data-testid": "2" }}
            />
          </div>
          )}
          <br /> <br />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
