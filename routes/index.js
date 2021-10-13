const router = require("express").Router();
const UserController = require("../controllers/userController");
const { errorHandler } = require("../errorHandlers/errorHandler");
const { authentication } = require("../middlewares/auth");

// endpoint profile
router.post("/login", UserController.login);
router.post("/register", UserController.register); // lat-long location user

// router.get("/interest", UserController.getInterest); //get semua interest user yg pake apps

// router.post("/interest"); //gabung sm register

// authentication mulai dari sini
router.use(authentication);
router.get("/interest", UserController.getInterestLogin); //get semua interest user yg login
router.put("/profile", UserController.editProfile); // image ditambahin after login pertama kali

// endpoint explore
router.get("/user"); // list user yang akan ditampilkan diexplore (location), yang match tidak sama dengan false, dan user itu sendiri, interest (optional, styling)

// cek dulu, apakah calon target tersebut sudah like user yang sedang login
// kalo belum user login sebagai authorId => statusnya true, target status null
router.post("/user"); // action, antara like atau dislike.

// kalo udah ada tabel yang dia sebagai target dari user yang mau dilike, swipe kiri = false, kanan = true
router.put("/user");

// jika authorStatus dan targetStatus === true, kita buat table chat

// endpoint chat
// chat (firestore), videocall (daily api), calendar (expo react native calendar), rekomendasi tempat date
router.get("/chat");
router.post("/chat");

router.get("/videocall");

router.get("/meetup");
router.post("/meetup");
router.put("/meetup");

router.get("/place");

router.use(errorHandler);

module.exports = router;
