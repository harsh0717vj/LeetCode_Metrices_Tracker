document.addEventListener("DOMContentLoaded",function(){
    const searchButton=document.getElementById("search-btn");
    const usernameInput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgressCircle=document.querySelector(".easyprogress");
    const mediumProgressCircle=document.querySelector(".mediumprogress");
    const hardProgressCircle=document.querySelector(".hardprogress");
    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");
    const cardsStatsContainer=document.querySelector(".stats-cards");
    function validateUsername(username){
        if(username.trim()===""){
            alert("Username should not be empty");
            return false;
        }
        const regex=/^[a-zA-Z0-9_-]{1,20}$/;
        const isMatching=regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;
    }
    async function fetchUserDetails(username){
        
        try{
            searchButton.textContent="Searching...";
            searchButton.disabled=true;    
            const url=`https://alfa-leetcode-api.onrender.com/${username}/solved`;
            const response=await fetch(url);
            if(!response.ok){
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            const parseddata=await response.json();
            displayUserData(parseddata);
        }
        catch(error){
            statsContainer.innerHTML=`<p>${error.message}</p>`;
        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
        }
    }

    function updateProgress(solved,total,label,circle){
        const progressDegree=(solved/total)*100;
        circle.style.setProperty(`--progress-degree`,`${progressDegree}%`);
        label.textContent=`${solved}/${total}`;
    }
    function displayUserData(parseddata){
        const totalQues=3928;
        const totalEasyQues=943;
        const totalMediumQues=2054;
        const totalHardQues=931;
        const solvedTotalQuestion=parseddata.solvedProblem;
        const solvedTotalEasyQuestion=parseddata.easySolved;
        const solvedTotalMediumQuestion=parseddata.mediumSolved;
        const solvedTotalHardQuestion=parseddata.hardSolved;

        updateProgress(solvedTotalEasyQuestion,totalEasyQues,easyLabel,easyProgressCircle);
        updateProgress(solvedTotalMediumQuestion,totalMediumQues,mediumLabel,mediumProgressCircle);
        updateProgress(solvedTotalHardQuestion,totalHardQues,hardLabel,hardProgressCircle);
        const cardData=[
            {label:"Overall Submissions",value:parseddata.totalSubmissionNum[0].submissions},
            {label:"Easy Submissions",value:parseddata.totalSubmissionNum[1].submissions},
            {label:"Medium Submissions",value:parseddata.totalSubmissionNum[2].submissions},
            {label:"Hard Submissions",value:parseddata.totalSubmissionNum[3].submissions},
        ];
        cardsStatsContainer.innerHTML=cardData.map( 
            data=>{
                return`
                <div class="card">
                        <h4>${data.label}</h4>
                        <p>${data.value}</p>
                    </div>`
            }
        ).join("");
    }
    function handleDetails(username){  
        console.log("Loggin username: ",username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    }
    searchButton.addEventListener('click',function(event){
        const username=usernameInput.value;
        handleDetails(username);
    })
    usernameInput.addEventListener('keydown',function(event){
        if(event.key==='Enter'){
            const username=usernameInput.value;
            handleDetails(username);
        }
    })
})
