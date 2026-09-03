
const CONFIG = {

 
    className: "Thanh Xuân của 9A2",

    description:
        "Nơi lưu giữ những ngày tháng đẹp nhất của 9A2.",


    question: {

        image: "assets/question.jpg",

        text: "Biệt danh của lớp trưởng là gì?",

        answers: [
            {
                text: "A. QBV",
                correct: false
            },

            {
                text: "B. học bá",
                correct: false
            },

            {
                text: "C. Vua về nhì",
                correct: true
            },

            {
                text: "D. nhắn tin = roblox:))",
                correct: false
            }
        ]

    },


    /* THÀNH VIÊN */

    members: [

        {
            name: "Quách Phương Vy",
            role: "Lớp trưởng",

            image:
                "assets/members/an-binh.jpg",

            hobby:
                "học",

            message:
                "Yêu cả nhà."
        },


        {
            name: "Minh Anh",
            role: "Thành viên",

            image:
                "assets/members/minh-anh.jpg",

            hobby:
                "Âm nhạc, Đọc sách",

            message:
                "Mong mọi người luôn vui."
        },


        {
            name: "Thu Ngân",
            role: "Thành viên",

            image:
                "assets/members/thu-ngan.jpg",

            hobby:
                "Chụp ảnh",

            message:
                "Cảm ơn vì đã đồng hành."
        },


        {
            name: "Đinh Hoàng Ngọc Hà",
            role: "lớp phó kiêm học bá",

            image:
                "assets/members/thanh-binh.jpg",

            hobby:
                "chưa biết",

            message:
                "Hẹn gặp lại nhé."
        }

    ],


    /* ẢNH KỶ NIỆM */

    gallery: [

        "assets/gallery/01.jpg",

        "assets/gallery/02.jpg",

        "assets/gallery/03.jpg",

        "assets/gallery/04.jpg",

        "assets/gallery/05.jpg",

        "assets/gallery/06.jpg",

        "assets/gallery/07.jpg",

        "assets/gallery/08.jpg",

        "assets/gallery/09.jpg",

        "assets/gallery/10.jpg"

    ],


    /* DÒNG THỜI GIAN */

    timeline: [

        {
            date: "Tháng 1, 2025",

            title: "Ôn Thi Học Kỳ",

            text:
                "Những ngày miệt mài bên sách vở, cùng nhau cố gắng cho một kết quả tốt nhất."
        },


        {
            date: "Tháng 2, 2025",

            title: "Tết Nguyên Xuân",

            text:
                "Cùng nhau chụp những tấm ảnh, cùng nhau chạy hết mình trong những ngày đầu năm."
        },


        {
            date: "Tháng 3, 2025",

            title: "Ngày 8/3",

            text:
                "Những món quà nhỏ nhưng chứa đựng rất nhiều tình cảm dành cho các bạn nữ."
        },


        {
            date: "Tháng 5, 2025",

            title: "Một Chặng Đường",

            text:
                "Những ngày tháng học tập và vui chơi cùng nhau trở thành ký ức."
        },


        {
            date: "Tháng 6, 2026",

            title: "Ngày Chia Tay",

            text:
                "Một hành trình kết thúc để những hành trình mới bắt đầu."
        }

    ],


    /* LỜI NHẮN */

    wishes: [

        {
            name: "An Bình",

            text:
                "Chúc tất cả chúng ta luôn vui vẻ và thành công trên con đường phía trước."
        },


        {
            name: "Minh Anh",

            text:
                "Mong rằng những ngày tháng này sẽ luôn là một phần ký ức đẹp."
        },


        {
            name: "Thanh Bình",

            text:
                "Thanh xuân của chúng ta tuy ngắn nhưng những kỷ niệm thì sẽ còn mãi."
        },


        {
            name: "Thu Ngân",

            text:
                "Hẹn gặp lại ở một phiên bản tốt hơn của chính chúng ta."
        },


        {
            name: "Hoàng Dũng",

            text:
                "Cảm ơn vì đã cùng nhau tạo nên những năm tháng đáng nhớ."
        },


        {
            name: "Lê Chi",

            text:
                "Mong rằng dù sau này mỗi người một nơi, chúng ta vẫn nhớ về nhau."
        },


        {
            name: "Bảo Thy",

            text:
                "Chúc mọi người đạt được những điều mình mong muốn."
        },


        {
            name: "Tập thể lớp",

            text:
                "Cảm ơn vì đã biến một lớp học thành một gia đình."
        }

    ],


    /* NHẠC */

    music: [

        {
            name: "Có hẹn với thanh xuân",

            file:
                "assets/music/cohenvoithanhxuan.mp3",

            cover:
                "assets/anh/avt.png"
        },


        {
            name: "Mình cùng nhau đóng băng",

            file:
                "assets/music/db.mp3",

            cover:
                "assets/anh/mcndb.png"
        },


        {
            name: "Năm tháng ấy",

            file:
                "assets/music/nta.mp3",

            cover:
                "assets/anh/nta.png"
        }

    ]

};



const $ = selector =>
    document.querySelector(selector);



document.title =
    CONFIG.className + " - Lưu Bút";

$("#classTitle").textContent =
    CONFIG.className;

$("#classDescription").textContent =
    CONFIG.description;



const gatekeeper =
    $("#gatekeeper");

const answers =
    $("#answers");

const gateMessage =
    $("#gateMessage");

$("#questionImage").src =
    CONFIG.question.image;

$("#questionText").textContent =
    CONFIG.question.text;


function createQuestion() {

    answers.innerHTML = "";

    CONFIG.question.answers.forEach(answer => {

        const button =
            document.createElement("button");

        button.className =
            "answer-button";

        button.textContent =
            answer.text;

        button.onclick = () => {

            if (answer.correct) {

                gateMessage.textContent =
                    "Chính xác ♥";

                gateMessage.style.color =
                    "#4f9b72";

                setTimeout(() => {

                    gatekeeper.classList.add("hidden");

                }, 500);

            } else {

                gateMessage.textContent =
                    "Sai rồi, thử lại nhé.";

                gateMessage.style.color =
                    "#d16c78";

            }

        };

        answers.appendChild(button);

    });

}

createQuestion();


$("#closeGate").onclick = () => {

    gatekeeper.classList.add("hidden");

};


/* =========================
   MEMBERS
========================= */

const membersContainer =
    $("#membersContainer");


CONFIG.members.forEach((member, index) => {

    const card =
        document.createElement("div");

    card.className =
        "member-card";

    card.innerHTML = `

        <img
            src="${member.image}"
            alt="${member.name}"
        >

        <h3>
            ${member.name}
        </h3>

        <p>
            ${member.role}
        </p>

    `;

    card.onclick = () =>
        openMember(index);

    membersContainer.appendChild(card);

});


/* =========================
   MEMBER MODAL
========================= */

const memberModal =
    $("#memberModal");


function openMember(index) {

    const member =
        CONFIG.members[index];

    $("#modalMemberImage").src =
        member.image;

    $("#modalMemberName").textContent =
        member.name;

    $("#modalMemberRole").textContent =
        member.role;

    $("#modalMemberHobby").textContent =
        member.hobby;

    $("#modalMemberMessage").textContent =
        member.message;

    memberModal.classList.add("show");

}


document.querySelector(".modal-close")
    .onclick = () => {

        memberModal.classList.remove("show");

    };


memberModal.onclick = event => {

    if (event.target === memberModal) {

        memberModal.classList.remove("show");

    }

};


/* =========================
   GALLERY
========================= */

const galleryContainer =
    $("#galleryContainer");

let currentImage = 0;


CONFIG.gallery.forEach((image, index) => {

    const item =
        document.createElement("div");

    item.className =
        "gallery-item";

    item.innerHTML = `

        <img src="${image}">

    `;

    item.onclick = () => {

        currentImage = index;

        showImage();

    };

    galleryContainer.appendChild(item);

});


const imageModal =
    $("#imageModal");


function showImage() {

    $("#largeImage").src =
        CONFIG.gallery[currentImage];

    imageModal.classList.add("show");

}


$(".image-close").onclick = () => {

    imageModal.classList.remove("show");

};


$("#previousImage").onclick = event => {

    event.stopPropagation();

    currentImage--;

    if (currentImage < 0)
        currentImage =
            CONFIG.gallery.length - 1;

    showImage();

};


$("#nextImage").onclick = event => {

    event.stopPropagation();

    currentImage++;

    if (
        currentImage >=
        CONFIG.gallery.length
    )
        currentImage = 0;

    showImage();

};


imageModal.onclick = event => {

    if (event.target === imageModal) {

        imageModal.classList.remove("show");

    }

};


/* =========================
   TIMELINE
========================= */

const timelineContainer =
    $("#timelineContainer");


CONFIG.timeline.forEach(item => {

    const element =
        document.createElement("div");

    element.className =
        "timeline-item";

    element.innerHTML = `

        <div class="timeline-dot"></div>

        <div class="timeline-content">

            <small>
                ${item.date}
            </small>

            <h3>
                ${item.title}
            </h3>

            <p>
                ${item.text}
            </p>

        </div>

    `;

    timelineContainer.appendChild(element);

});


/* =========================
   WISHES
========================= */

const wishesContainer =
    $("#wishesContainer");


CONFIG.wishes.forEach(wish => {

    const element =
        document.createElement("div");

    element.className =
        "wish";

    element.innerHTML = `

        <p>
            ${wish.text}
        </p>

        <strong>
            — ${wish.name}
        </strong>

    `;

    wishesContainer.appendChild(element);

});


/* =========================
   MUSIC
========================= */

const audio =
    $("#audio");

const musicPlayer =
    $("#musicPlayer");

const musicName =
    $("#musicName");

const musicCover =
    $("#musicCover");

let currentMusic = 0;


function loadMusic(index) {

    const music =
        CONFIG.music[index];

    audio.src =
        music.file;

    musicName.textContent =
        music.name;

    musicCover.src =
        music.cover;

}


function playCurrentMusic() {

    loadMusic(currentMusic);

    audio.play()
        .catch(() => {});

    musicPlayer.classList.add("show");

    $("#playMusic").textContent =
        "❚❚";

}


function pauseMusic() {

    audio.pause();

    $("#playMusic").textContent =
        "▶";

}


$("#musicButton").onclick = () => {

    musicPlayer.classList.add("show");

    if (audio.paused) {

        playCurrentMusic();

    }

};


$("#playMusic").onclick = () => {

    if (audio.paused) {

        playCurrentMusic();

    } else {

        pauseMusic();

    }

};


$("#nextMusic").onclick = () => {

    currentMusic++;

    if (
        currentMusic >=
        CONFIG.music.length
    )
        currentMusic = 0;

    playCurrentMusic();

};


$("#prevMusic").onclick = () => {

    currentMusic--;

    if (currentMusic < 0)
        currentMusic =
            CONFIG.music.length - 1;

    playCurrentMusic();

};


$("#closeMusic").onclick = () => {

    musicPlayer.classList.remove("show");

};


audio.onended = () => {

    currentMusic++;

    if (
        currentMusic >=
        CONFIG.music.length
    )
        currentMusic = 0;

    playCurrentMusic();

};


/* =========================
   ESC ĐỂ ĐÓNG MODAL
========================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            memberModal.classList.remove(
                "show"
            );

            imageModal.classList.remove(
                "show"
            );

        }

    }
);