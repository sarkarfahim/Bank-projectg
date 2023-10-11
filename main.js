const accounts = [
{
  owner :"fahim sarker",
  movments : [2000,4000,-8000,-5000,2400,9000],
  intetest : 1.7,
  password: 1234,
  currency :"USD",
  locale :"en-US",
 movmentsDates: [
  "2023-08-27T21:31:17.671Z",
  "2023-08-30T23:31:17.071Z",
  "2023-08-19T20:31:17.601Z",
  "2023-08-30T07:31:17.432Z",
  "2023-08-28T18:31:17.231Z",
  "2023-08-11T09:31:17.071Z",
 ]
},
{
  owner :"sarker fahim",
  movments : [5000, 4000, -8000, -5000, 2400, 9000],
  intetest : 1.5,
  password: 1234,
  currency :"USD",
  locale :"en-US",
   movmentsDates: [
  "2023-08-30T21:31:17.681Z",
  "2023-08-31T 1:31:17.001Z",
  "2023-07-19T20:31:17.641Z",
  "2023-07-17T07:31:17.482Z",
  "2023-08-13T18:31:17.291Z",
  "2023-08-11T09:31:17.011Z",
 ]
},
]

const getWelcome = document.querySelector(".welcome");

const containerApp= document.querySelector(".app");
 const labelDate= document.querySelector(".date");
const labelBalance= document.querySelector(".balance-value");
const containerMovments= document.querySelector(".movments");

const summarryIn= document.querySelector(".summary-value-in");
const summarryOut= document.querySelector(".summary-value-out");
const summarryInter= document.querySelector(".summary-value-inter");
    const inputLoan = document.querySelector(".form-input-loan-amount");    
const loginUsername= document.querySelector(".login-input-username");
const loginUserpass= document.querySelector(".login-input-password");
const inputFormTo= document.querySelector(".form-input-to");
const inputAmount= document.querySelector(".form-input-amount");

const formInputUser= document.querySelector(".form-input-username");
const formInputPass= document.querySelector(".form-input-pass");
const timer= document.querySelector(".timer");

const btnLogin= document.querySelector(".login-btn");

const btnTransfer= document.querySelector(".form-btn-tranfer");
const btnLoan= document.querySelector(".form-btn-loan");
const btnClose= document.querySelector(".form-btn-close");
const btnSort= document.querySelector(".btn-sort");





////////////ui

function updateui(currentAccount){

displayMovments(currentAccount);
displaySummarry(currentAccount);
displayBalance(currentAccount);

}



function formateCurrency(value,locale,currency){
 return new Intl.NumberFormat(locale,{
  style : "currency",
  currency :currency,
 }).format(value);
}


/////////////////
//calculate dateand time
function calculateDate(date4,locale){

  const calculeTimestamp = (date1,date2) =>Math.round(Math.abs(date1-date2)/(24 * 60 * 60 * 1000));
  
  const daysPasssed = calculeTimestamp(new Date(), date4);

  if (daysPasssed === 0) return "today";
  if(daysPasssed === 1) return "yesterday";
  if(daysPasssed <=7) return `${daysPasssed} days ago`;

    return new Intl.DateTimeFormat(locale,{
      year :"numeric",
      month:"short",
      day:"numeric" }).format(date4);
};


/////////////
///username

function createUsername (accounts){
 accounts.forEach(account =>{
  account.username = account.owner
                   .toLowerCase()
                   .split(' ')
                   .map(word => word.at(0))
                   .join('')
                     
 });

};
createUsername(accounts);

////login
///////////////////////////////////

let currentAccount;

btnLogin.addEventListener('click',function(e){
  e.preventDefault();
  
  currentAccount= accounts.find(account => account.username === loginUsername.value);
  
  if(currentAccount?.password === Number(loginUserpass.value) ){
 setTimeout(() => {
   //// display us and welcome
  getWelcome.textContent= `welcome come back, ${currentAccount.owner
                                            .split(' ')
                                            .at(0)
                                            }` 

containerApp.style.opacity= 1;
///time and date update
const now = new Date();
const options={
  year:"numeric",
  month:"numeric",
  day:"numeric",
  hour:"numeric",
  minute:"numeric",

};
console.log(now,options);

 labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale,options).format(now);
 console.log(labelDate.textContent);

////ui
 updateui(currentAccount);
 },3000);
}
 else{
 setTimeout(() => {
   getWelcome.textContent = " login faild, try again";
  containerApp.style.opacity= 0;
 },1000);
 }
 //clear filed

 loginUsername.value = loginUserpass.value = '';
 loginUserpass.blur();
  
})



////////////////////////////////////////////////////////////////////////////////////////////container momvment

function displayMovments(account, sort = false){
  containerMovments.innerHTML='';
  const moves = sort?account.movments.slice(0).sort((a,b) => a-b) : account.movments;
  moves.forEach((move,i)=>{
   const type = move > 0 ? 'deposit': 'withdrwal';
   const date4 = new Date(account.movmentsDates[i]);
   const displayDateTime = calculateDate(date4,account.locale);
   
   const formatMove= formateCurrency(move,account.locale,account.currency);
    const html = `<div class="movments-row">
      <div class="movments-type  movments-type-${type}">${i+1} ${type}</div>
      <div class="movments-date">${displayDateTime}</div>
      <div class="movments-valu">${formatMove}</div>
    </div>`;
   
   containerMovments.insertAdjacentHTML('afterbegin',html);
  });
};


//////////////////////
///summarry

function displaySummarry(account){
  ///income
  const income = account.movments.filter(move => move >0).reduce((deposite,acc) => deposite+acc,0);
  summarryIn.textContent = formateCurrency(income,account.locale,account.currency);
   ///outcome
 
  const outcome = account.movments.filter(move => move <0).reduce((deposite,acc) => deposite+acc,0);
  summarryOut.textContent = formateCurrency(Math.abs(outcome),account.locale,account.currency);

  /////interesr
  const inter = account.movments.filter(move => move>0).map(deposite => deposite * account.intetest /100).reduce((acc,interes)=> acc+interes,0);
  summarryInter.textContent = formateCurrency(inter,account.locale,account.currency);
};
//////balance//

///////////////////////////////////////////////////
function displayBalance(account){
account.balance= account.movments.reduce((acc,move)=> acc+move,0);
labelBalance.textContent= formateCurrency (
  account.balance,
  account.locale,
  account.currency);
}


btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
 
  const reciver = accounts.find(account =>
    account.username === inputFormTo.value
  );

  const amount = Number(inputAmount.value);

  if(amount >0  && amount<= currentAccount.balance && currentAccount.username !== reciver.username && reciver){
      setTimeout(()=>{
        ////transfer
       currentAccount.movments.push(-amount);
       reciver.movments.push(amount);
       updateui(currentAccount);

       
       ////msg
      getWelcome.textContent = " transfer succesful";

      },4000)

  }else{

   setTimeout(() => {
     getWelcome.textContent="faild";
   },3000);
  };

  //////clear fields
  inputFormTo.value = inputAmount. value ='';
  inputAmount.blur();

})

//////////////loan

btnLoan.addEventListener('click',function(e){
  e.preventDefault();

  const loanAmount = Number(inputLoan.value);
  if(loanAmount>0 && 
    currentAccount.movments.some(move => move > loanAmount*0.1)){
      setTimeout(() => {
        ///loan
       currentAccount.movments.push(loanAmount);
      //uiupdate
      updateui(currentAccount);
      ///msg
      getWelcome.textContent = " loan suceess"
      }, 2000);
    }
    else{
      setTimeout(()=>{ getWelcome.textContent = " loan faild"},2000)
     
    }
    /////clear fileds
    inputLoan.value= "";
    inputLoan.blur();

});

///////////////////////////////////////////////////////////////////////////////////////////////////close account
btnClose.addEventListener('click',function(e){
  e.preventDefault();
if(currentAccount.username === formInputUser.value && currentAccount.password === Number(formInputPass.value)){
 const index =  accounts.indexOf(account=> account.username === currentAccount.username);

 setTimeout(() => {
  //// close
 accounts.slice(index,1);
 ///ui
 containerApp.style.opacity = 0;
 ///msg
 getWelcome.textContent= " close";
 }, 3000);
}else{
  setTimeout(() => {
    getWelcome.textContent= " faild";
  }, 3000);
}

/////clear fields
formInputPass.value = formInputUser.value = '';
formInputPass.blur();
})

//////////////////////////////////////////////

////////sort

let sorten = false;

btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovments(currentAccount, !sorten);

 sorten =!sorten;
})