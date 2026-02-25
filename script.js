let quizData = [];
let userAnswers = {};
let isLocked = false;
let startTime = 0;

/* ĐỌC FILE */
document.getElementById('fileInput').addEventListener('change', function(e){

    const reader = new FileReader();

    reader.onload = function(){

        parseFileData(reader.result);

    };

    reader.readAsText(e.target.files[0]);

});


/* TÁCH FILE */
function parseFileData(data){

    const lines = data.split('\n');

    quizData = [];

    let current = null;

    lines.forEach(line=>{

        if(line.startsWith("Câu hỏi:")){

            if(current) quizData.push(current);

            current = {

                q: line.replace("Câu hỏi:","").trim(),

                options: [],

                correctIndex: 0
            };
        }

        else if(line.startsWith("Đáp án:")){

            let correct =
                line.replace("Đáp án:","").trim();

            let options = [

                correct,
                "Đáp án sai 1",
                "Đáp án sai 2",
                "Đáp án sai 3"

            ];

            options = shuffle(options);

            current.options = options;

            current.correctIndex =
                options.indexOf(correct);
        }

    });

    if(current) quizData.push(current);

    alert("Đã tải "+quizData.length+" câu hỏi");

}


/* XÁO TRỘN */
function shuffle(arr){

    return arr.sort(()=>Math.random()-0.5);

}


/* BẮT ĐẦU */
document.getElementById('startBtn').onclick = function(){

    if(quizData.length===0){

        alert("Hãy tải file");

        return;
    }

    startTime = Date.now();

    userAnswers = {};

    isLocked = false;

    document.getElementById('home-page').style.display='none';

    document.getElementById('quiz-page').style.display='block';

    renderQuiz();

};


/* RENDER */
function renderQuiz(){

    const container =
        document.getElementById('quizContent');

    container.innerHTML =
        quizData.map((item,index)=>`

        <div class="question-block" id="q-${index}">

            <div class="q-circle">
                ${index+1}
            </div>

            <p>
                <strong>${item.q}</strong>
            </p>

            ${
                item.options.map((opt,i)=>`

                <div class="ans-option"
                onclick="selectAns(${index},${i})">

                    <div class="ans-circle">
                        ${String.fromCharCode(65+i)}
                    </div>

                    <div class="ans-text"
                    id="opt-${index}-${i}">

                        ${opt}

                    </div>

                </div>

                `).join('')
            }

            <div id="explain-${index}"
            style="display:none;color:blue">

                Giải thích: đáp án đúng là
                ${
                    item.options[item.correctIndex]
                }

            </div>

        </div>

        `).join('');

}


/* CHỌN */
function selectAns(qIdx,optIdx){

    if(isLocked) return;

    userAnswers[qIdx]=optIdx;

    document
    .querySelectorAll(
        `#q-${qIdx} .ans-text`
    )
    .forEach(el=>el.style.background="white");

    document
    .getElementById(
        `opt-${qIdx}-${optIdx}`
    )
    .style.background="#cce5ff";

}


/* NỘP */
document.getElementById('submitBtn').onclick =
submitQuiz;


function submitQuiz(){

    if(isLocked) return;

    if(Object.keys(userAnswers).length
        !== quizData.length){

        alert("Chưa làm hết");

        return;
    }

    isLocked=true;

    let correctCount=0;

    quizData.forEach((q,index)=>{

        let user=userAnswers[index];

        let correct=q.correctIndex;

        let correctEl=
            document.getElementById(
                `opt-${index}-${correct}`
            );

        correctEl.style.border=
            "2px solid green";

        if(user===correct){

            correctCount++;

        }
        else{

            let userEl=
                document.getElementById(
                    `opt-${index}-${user}`
                );

            userEl.style.border=
                "2px solid red";

            document.getElementById(
                `explain-${index}`
            ).style.display="block";
        }

    });

    let timeSpent=getTimeSpent();

    let result={

        id:Date.now(),

        score:correctCount,

        total:quizData.length,

        time:timeSpent,

        timeText:formatTime(timeSpent),

        date:new Date().toLocaleString(),

        answers:userAnswers,

        quiz:quizData
    };

    saveHistory(result);

    alert(
        "Điểm: "+correctCount+
        "/"+quizData.length
    );

}


/* THỜI GIAN */
function getTimeSpent(){

    return Math.floor(
        (Date.now()-startTime)/1000
    );

}


function formatTime(sec){

    let m=Math.floor(sec/60);

    let s=sec%60;

    return m+":"+s.toString()
        .padStart(2,'0');

}


/* LƯU */
function saveHistory(result){

    let history=
        JSON.parse(
            localStorage.getItem(
                "quizHistory"
            )
        ) || [];

    history.push(result);

    localStorage.setItem(
        "quizHistory",
        JSON.stringify(history)
    );

}


/* LOAD */
function loadHistory(){

    let history=
        JSON.parse(
            localStorage.getItem(
                "quizHistory"
            )
        ) || [];

    console.log(history);

}

loadHistory();


/* THOÁT */
function askExit(){

    if(confirm("Bạn có muốn thoát không")){

        location.reload();

    }

                                }
