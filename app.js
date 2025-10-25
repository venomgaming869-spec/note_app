let creatNoteBtn = document.querySelector(".create-note");
let form = document.querySelector(".create-container");
let deleteForm = document.querySelector(".deleteform")
let inpTitle = document.querySelector(".tittle");
let inpTextarea = document.querySelector(".textarea");
let closeBtn = document.querySelector(".close");
let parentOfCards = document.querySelector(".cardDiv");
let cancel_btn = document.querySelector(".cancel-btn")

//hameee ab yaha array banake usme save karvana h kyuki 
//wo update kr raha h item ko

creatNoteBtn.addEventListener("click", () => {
    form.style.display = "initial";
})

function creatNote(e) {
    let allfields = JSON.parse(localStorage.getItem("fields"))
    if (allfields && e === undefined) {
        allfields.forEach(elem => {
            let card = document.createElement("div");
            let h4 = document.createElement("h4");
            let p = document.createElement("p");


            card.classList.add("card");
            parentOfCards.appendChild(card);
            card.appendChild(h4);
            card.appendChild(p);

            h4.textContent = elem.inptittle
            p.textContent = elem.inptextarea
        });
    }

    if (e === true) {
        let lastnote = allfields[allfields.length - 1]
        let card = document.createElement("div");
        let h4 = document.createElement("h4");
        let p = document.createElement("p");


        card.classList.add("card");
        parentOfCards.appendChild(card);
        card.appendChild(h4);
        card.appendChild(p);

        h4.textContent = lastnote.inptittle
        p.textContent = lastnote.inptextarea
        checkhold();

        return;
    }
}



function saveToLocal(obj) {
    if (localStorage.getItem("fields") === null) {
        let oldFields = [];
        oldFields.push(obj);
        localStorage.setItem("fields", JSON.stringify(oldFields));
    } else {
        let oldFields = localStorage.getItem("fields");
        oldFields = JSON.parse(oldFields);
        oldFields.push(obj);
        localStorage.setItem("fields", JSON.stringify(oldFields));
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let inptittle = inpTitle.value.trim();
    let inptextarea = inpTextarea.value.trim();

    if (inptittle === "" && inptextarea === "") {
        alert("fields are blank")
        return;
    }

    saveToLocal({
        inptittle,
        inptextarea,
    })
    creatNote(true)
    form.reset();
    form.style.display = "none";
})

closeBtn.addEventListener("click", () => {
    form.style.display = "none";
})

function checkhold() {
    const cards = document.querySelectorAll(".card");
    let holdTimer;
    let islong = false;

    if (cards) {
        cards.forEach(card => {
            if (!card.dataset.hashold) {
                card.addEventListener("pointerdown", (e) => {
                    e.preventDefault();
                    islong = false;
                    holdTimer = setTimeout(() => {
                        showMenu(e, card);
                        islong = true;
                    }, 500);
                    card.addEventListener("pointerup", () => {
                        clearTimeout(holdTimer)
                        if (!islong) {
                            fullscreen(card);
                        }
                    });
                    card.addEventListener("pointerleave", () => clearTimeout(holdTimer));
                    card.dataset.hasHold = "true"; // 👈 mark as already set
                });
            }
        })
    }
}

// function cardsfilter() {

// }

function showMenu(e, card) {
    let menu = document.querySelector(".menu-container");

    menu.innerHTML = "";
    menu.replaceWith(menu.cloneNode(true));
    const newMenu = document.querySelector(".menu-container")

    const option = ["Blur", "Delete"];
    option.forEach(opt => {
        const li = document.createElement("li");
        li.textContent = opt;
        newMenu.appendChild(li);
    })

    newMenu.style.left = e.pageX + "px";
    newMenu.style.top = e.pageY + "px";
    newMenu.style.display = "initial";


    setTimeout(() => {
        window.addEventListener("pointerdown", () => {
            newMenu.style.display = "none";
            newMenu.innerHTML = "";
        })
    }, 1000);

    newMenu.addEventListener("pointerdown", (e) => {
        if (e.target.matches("li")) {
            let choice = e.target.textContent;
            if (choice === "Blur") {
                card.classList.toggle("blur");
            }
            if (choice === "Delete") {
                deleteForm.style.display = "initial"
                deleteForm.addEventListener("submit", (evt) => {
                    evt.preventDefault();
                    if (evt.type === "submit") {
                        console.log(evt)
                        deleteForm.style.display = "none"
                        let tittle = card.querySelector("h4").innerText;
                        let p = card.querySelector("p").innerText;
                        let allNotes = JSON.parse(localStorage.getItem("fields"))
                        allNotes = allNotes.filter(val => !(val.inptittle === tittle && val.inptextarea === p));
                        localStorage.setItem("fields", JSON.stringify(allNotes));
                        parentOfCards.innerHTML = "";
                        creatNote();
                        checkhold();
                    }
                    cancel_btn.addEventListener("click", (evt2) => {
                        evt2.preventDefault()
                        deleteForm.style.display = "none";
                    })
                })
                // if (true) {
                //     let tittle = card.querySelector("h4").innerText;
                //     let p = card.querySelector("p").innerText;
                //     let allNotes = JSON.parse(localStorage.getItem("fields"))
                //     allNotes = allNotes.filter(val => !(val.inptittle === tittle && val.inptextarea === p));
                //     localStorage.setItem("fields", JSON.stringify(allNotes));
                //     parentOfCards.innerHTML = "";
                //     creatNote();
                //     checkhold();
                // }
            }
        }
    })
}

function fullscreen(card) {
    let fullscreen_bg = document.querySelector(".fullscreen");
    fullscreen_bg.style.display = "initial"

    fullscreen_bg.innerHTML = ""
    let icon = document.createElement("i");
    icon.className = "fa-solid fa-chevron-left"
    let h4 = document.createElement("h4");
    let p = document.createElement("p");

    h4.classList.add("fullscreen-h4");
    p.classList.add("fullscreen-p");

    h4.textContent = card.querySelector("h4").innerText;
    p.textContent = card.querySelector("p").innerText;


    fullscreen_bg.appendChild(icon);
    fullscreen_bg.appendChild(h4);
    fullscreen_bg.appendChild(p);

    icon.addEventListener("click", () => {
        fullscreen_bg.style.display = "none";
    })
}
creatNote();
checkhold();