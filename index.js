// express 설치 후 모듈 불러오기
const express = require("express");
const axios = require("axios");
const cors = require("cors");

// express 실행(function call)
const app = express();

const dotenv = require("dotenv").config();
const NAVER_ID = process.env.NAVER_ID;
const NAVER_SECRET_ID = process.env.NAVER_SECRET_ID;

// port 지정
// autoset apache default 80
app.set("port", process.env.PORT || 8099);
const PORT = app.get("port");

app.use(cors());

// routing
app.get("/", (req, res) => {
  res.send("hello");
});

// 중간대리인 역할
// json return
// *** json({}) 객체 중괄호 처리 {} 까먹지 말기!***
app.get("/book/:bookname", (req, res) => {
  console.log(req.params.bookname);
  const bookname = encodeURIComponent(req.params.bookname);
  axios({
    url: `https://openapi.naver.com/v1/search/book.json?query=${bookname}`,
    // * 한글인식 err 처리
    // >> encodeURIComponent
    // const bookname = encodeURIComponent(req.params.bookname);
    headers: {
      "X-Naver-Client-Id": NAVER_ID,
      "X-Naver-Client-Secret": NAVER_SECRET_ID,
    },
  }).then(function (response) {
    // .then() : axios resolve, response로 data 잘 불러오나 확인
    // console.log(response.data); // console 확인용
    res.json(response.data);
  });
  // res.json({ book: "express" });
});

// app.get("/book02", (req, res) => {
//   const queryTxt = encodeURIComponent(req.query.bookname);
//   axios({
//     url: `https://openapi.naver.com/v1/search/book.json?query=${queryTxt}`,
//     headers: {
//       "X-Naver-Client-Id": NAVER_ID,
//       "X-Naver-Client-Secret": NAVER_SECRET_ID,
//     },
//   }).then(function (response) {
//     res.json(response.data);
//   });
// });

// 초간단 로그인 기능
app.get("/login", (req, res) => {
  console.log(req.query);
  if (req.query.id === "abcd1234" && req.query.pw === "12345") {
    res.json({ isLogged: true });
  } else {
    res.json({ isLogged: false });
  }
  res.send("로그인 화면");
});

// 영화(params)
app.get("/movie/:movieTitle", (req, res) => {
  console.log(req.params.movieTitle);
  const movieTitle = encodeURIComponent(req.params.movieTitle);
  axios({
    url: `https://openapi.naver.com/v1/search/movie.json?query=${movieTitle}`,
    headers: {
      "X-Naver-Client-Id": NAVER_ID,
      "X-Naver-Client-Secret": NAVER_SECRET_ID,
    },
  }).then(function (response) {
    res.json(response.data);
  });
});

// 쇼핑(query)
app.get("/shopping", (req, res) => {
  const queryTxt = encodeURIComponent(req.query.item);
  axios({
    url: `https://openapi.naver.com/v1/search/shop.json?query=${queryTxt}&display=30`,
    headers: {
      "X-Naver-Client-Id": NAVER_ID,
      "X-Naver-Client-Secret": NAVER_SECRET_ID,
    },
  })
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (err) {
      console.log("error");
    });
});

app.listen(PORT, function () {
  console.log(`${PORT}에서 서버 대기중`);
});
