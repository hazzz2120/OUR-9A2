
const CONFIG = {

 
    className: "Thanh Xuân của 9A2",

    description:
        "Nơi lưu giữ những ngày tháng đẹp nhất của 9A2.",


    question: {

        image: "assets/anh/qpv.png",

        text: "Biệt danh của lớp trưởng là gì?",

        answers: [
            {
                text: "A. QBV",
                correct: false
            },

            {
                text: "B. học bá",
                correct: true
            },

            {
                text: "C. Vua về nhì",
                correct: false
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
                "assets/anh/qpv.png",

            hobby:
                "học",

            message:
                "Yêu cả nhà."
        },


        {
            name: "",
            role: "Thành viên",

            image:
                "assets/members/minh-anh.jpg",

            hobby:
                "Âm nhạc, Đọc sách",

            message:
                "Mong mọi người luôn vui."
        },


        {
            name: "",
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
                "assets/anh/vvn.png",

            hobby:
                "chưa biết",

            message:
                "Hẹn gặp lại nhé."
        }

    ],


    /* ẢNH KỶ NIỆM */

    gallery: [

        "assets\anh\lop8.jpg",

        "assets/anh/lop8voithayduc.jpg",

        "assets/anh/ditn.jpg",

        "assets/anh/sinhnhat.jpg",

        "assets/anh/btqsvn.jpg",

        "assets/anh/0437dfa1-b52a-44d7-ade7-13d249cf5d1a.jpg",

        "assets/gallery/07.jpg",

        "assets/gallery/08.jpg",

        "assets/gallery/09.jpg",

        "assets/gallery/10.jpg"

    ],


    /* DÒNG THỜI GIAN */

    timeline: [

        {
            date: "Tháng 1,",

            title: "wait me for upd",

            text:
                "wait me for upd"
        },


        {
            date: "Tháng 2, 2026",

            title: "Tết Nguyên Đán",

            text:
                "Cùng nhau trang trí cho lớp."
        },


        {
            date: "Ngày 8, Tháng 3, 2026",

            title: "Ngày 8/3",

            text:
                "Những món quà nhỏ của con trai trong lớp dành cho các bạn nữ, tuy là món quà không to và còn tặng muộn:) nhưng chứa đựng nhiều tình cảm dành cho các bạn nữ. "
        },


        {
            date: "Tháng 5, 2025",

            title: "wait me for upd",

            text:
                "wait me for upd"
        },


        {
            date: "Tháng 6, ",

            title: "wait me for upd",

            text:
                "wait me for upd"
        }

    ],


    /* LỜI NHẮN */

    wishes: [

        {
            name: "Quách Phương Vy",

            text:
                "chờ cập nhật thêm:))"
        },


        {
            name: "Đinh Hoàng Ngọc Hà",

            text:
                "chờ cập nhật thêm:))"
        },


        {
            name: "Đinh Việt Anh",

            text:
                "chờ cập nhật thêm:))"
        },


        {
            name: "Nguyễn Tuyết Nhung",

            text:
                "chờ cập nhật thêm:))"
        },


        {
            name: "Nguyễn Minh Hiếu",

            text:
                "chờ cập nhật thêm:))"
        },


        {
            name: "Nguyễn Bảo Trâm",

            text:
                "chờ cập nhật thêm:))"
        },


        {
            name: "Nguyễn Trà My",

            text:
                "chờ cập nhật thêm:))"
        },


        {
            name: "Tập thể lớp",

            text:
                "chờ cập nhật thêm:))"
        },

        {
            name: "Đào Quốc Cường",

            text: 
                "chờ cập nhật thêm"
        },

        {
            name: "Phạm Ngọc Hân",

            text: 
                "chờ cập nhật thêm"
        },

        {
            name: "chờ:))",

            text: 
                "chờ cập nhật thêm"
        },

        {
            name: "chờ:))",

            text: 
                "chờ cập nhật thêm"
        },

        {
            name: "chờ:))",

            text: 
                "chờ cập nhật thêm"
        },

        {
            name: "chờ:))",

            text: 
                "chờ cập nhật thêm"
        },

        {
            name: "chờ:))",

            text: 
                "chờ cập nhật thêm"
        },

        {
            name: "chờ:))",

            text: 
                "chờ cập nhật thêm"
        },

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