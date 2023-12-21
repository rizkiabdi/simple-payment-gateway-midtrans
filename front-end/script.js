const orderId = document.getElementById('orderid')
const email = document.getElementById('email')
const price = document.getElementById('price')
const paymentMethod = document.getElementById('payment-method')
const btnPay = document.getElementById('btn-pay')
const modal = document.getElementById('modal-dialog')
const payCode = document.getElementById('code')
const total = document.getElementById('total')
const loading = document.getElementById('loading')
const close = document.getElementsByClassName('close')
const timeText = document.getElementById('time_text')
const containerQrcode = document.getElementById('c-qrcode')
const qrcode = document.getElementById('qrcode')
const logo = document.getElementById('logo')
const titleLogo = document.getElementById('title-logo')
const containerPayCode = document.getElementById('pay-code')
const containerAmount = document.getElementById('amount')
const timerCount = document.getElementById('countdown')
// Timer
let dayCounter = 0  
let hoursCounter = 0
let minutesCounter = 0
let secondsCounter = 0
function setCountDown(){
  timerCount.innerText = `${dayCounter/86400<=9?'0'+dayCounter/86400:dayCounter/86400} Day, ${hoursCounter/3600<=9?'0'+hoursCounter/3600:hoursCounter/3600}:${minutesCounter/60<=9?'0'+minutesCounter/60:minutesCounter/60}:${secondsCounter<=9?'0'+secondsCounter:secondsCounter}`
  setTimeout(()=>{
    if(dayCounter === 0 && hoursCounter===0 && minutesCounter===0 && secondsCounter===0){
      console.log('berakhir')
      return
    }
    if(hoursCounter === 0){
      if(dayCounter != 0){
        dayCounter-=86400
        hoursCounter=86400
      }
    }
    if(minutesCounter === 0){
      if(hoursCounter != 0){
        hoursCounter-=3600
        minutesCounter = 3600
      }
    }
    if(secondsCounter === 0){
      if(minutesCounter !=0){
        minutesCounter-=60
        secondsCounter = 60
      }
    }
    secondsCounter-=1
    setCountDown()
  },1000)
  console.log(`${hoursCounter/3600<=9?'0'+hoursCounter/3600:hoursCounter/3600}:${minutesCounter/60<=9?'0'+minutesCounter/60:minutesCounter/60}:${secondsCounter<=9?'0'+secondsCounter:secondsCounter}`)
}

function getDateExpired(expired){
  let date = new Date(expired)
  return [date.getDay(),date.getDate(),date.getMonth(),date.getFullYear()]
}
function getDateTimeNow(){
  const dateNow = new Date()
  return [dateNow.getDate(),dateNow.getHours(), dateNow.getMinutes(),dateNow.getSeconds()]
}
function getDateTimeExpired(expired){
  const dateExpired = new Date(expired)
  return [dateExpired.getDate(),dateExpired.getHours(), dateExpired.getMinutes(),dateExpired.getSeconds()]
}
function setDiffTime(timeExpired,timeNow){

  const [dateExpired,hoursExpired,minutesExpired,secondsExpired] = timeExpired
  const [dateNow,hoursNow,minutesNow,secondsNow] = timeNow
  console.log(timeExpired,timeNow)
  console.log(Math.abs((dateExpired-dateNow))*3600*24)
  dayCounter = Math.abs(dateExpired-dateNow)*3600*24
  hoursCounter = Math.abs(hoursExpired - hoursNow)*3600
  minutesCounter =Math.abs(minutesExpired-minutesNow)*60
  secondsCounter = Math.abs(secondsExpired-secondsNow) 
  console.log(dayCounter/86400,hoursCounter/3600,minutesCounter/60,secondsCounter)
  return 
}
async function pay(){
  try {
 
    const day = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu']
    const month = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
    loading.showModal()
    if(!window.navigator.onLine){
      throw {message:'periksa koneksi anda'}
    }
    const data = await fetch('http://localhost:3000/api/v1/transaction',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      mode:'cors',
      body:JSON.stringify({
        orderid:orderId.value,
        email:email.value,
        payment_method:paymentMethod.value,
        total:parseInt(price.value)
      })
    })
    const result = await data.json()
    console.log(result)
    if(result.status_code === '406'){
      throw {message:'order id sudah pernah digunakan'}
    }else if(result.status_code === '500' || result.status_code === '900'){
      throw {message:'silahkan coba lagi beberapa saat lagi'}
    }
    const [date,time] = result.expiry_time.split(' ')
    const timeExpired = getDateTimeExpired(date)
    const [dayExpired,dateExpired,monthExpired,yearExpired] = getDateExpired(date)
    const dayOfArray = day[dayExpired-1]
    const timeNow = getDateTimeNow()
    setDiffTime(timeExpired,timeNow)
    loading.close()
    modal.showModal()
    setCountDown()
    total.innerText = `Rp. ${parseInt(result.gross_amount)}`
    timeText.innerText = `${dayOfArray}, ${dateExpired} ${monthExpired} ${yearExpired} ${time} WIB`
    if(result.payment_type === 'gopay'){
      titleLogo.innerText = 'Gopay'
      logo.setAttribute('src','./image/gopay.png')
      qrcode.setAttribute('src',`${result.actions[0].url}`)
      containerPayCode.style.display = 'none'
      containerAmount.style.textAlign = 'center'
      // containerAmount.style.display = 'none'
    }else{
      titleLogo.innerText = 'Alfamart'
      logo.setAttribute('src','./image/alfamart.png')
      payCode.innerText = result.payment_code
      containerQrcode.style.display = 'none'
    }  
  } catch (error) {
    console.log(error)
    loading.close()
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: `${error.message}`,
    });
    
  }

}
function closeModal(){
  containerPayCode.style.display = 'block'
  containerQrcode.style.display = 'block'
  dayCounter = 0
  hoursCounter = 0
  minutesCounter =0
  secondsCounter = 0
  modal.close()
}
 
