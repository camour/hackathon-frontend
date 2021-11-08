const containersArray = ['cnt-379667708', 'cnt-379667708'];

if(JSON.parse(localStorage.getItem('identifiers'))){
  document.getElementsByClassName('form')[0].style.display = "none" ;
}else{
  document.getElementsByTagName('main')[0].style.display = "none" ;
}
//chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
const getData = () => {
  let identifiers = JSON.parse(localStorage.getItem('identifiers'));
  fetch("http://localhost:8282/~/mn-cse/cin-273837532",{
    method: 'GET',
    headers: {
      'X-M2M-Origin': identifiers.login+':'+identifiers.password,
      'Accept': 'application/json'
    }
  })
  .then(result => {
    if(result.ok){
      return result.json();
    }
    throw result;
  })
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.log(error);
  });
};

addEventListener('load', async () => {
  let sw = await navigator.serviceWorker.register('/sw.js');
  console.log('service worker registered locally : ');
  console.log(sw);
  console.log(" ");
  processToMonitorConstruction();
});

document.getElementById('formSubmitButton').addEventListener('click', connect);

const navigatorBroadcast = new BroadcastChannel('count-channel');
navigatorBroadcast.onmessage = (event) => {
  let payload = JSON.parse(event.data.payload);
  console.log(payload);
  let containerId = payload.pi.split('mn-cse/')[1];
  let containerDiv = document.getElementById('containerDiv'+ containerId);
  let containerDataDiv = document.getElementById('containerDataDiv'+ containerId);
  containerDataDiv.innerHTML = '';
  let dataDiv = document.createElement('div');
  dataDiv.classList.add('dataDiv');
  let data = payload.con.split('=\"')[2].split('"')[0];
  if(getContainerName(containerId)==='TEMPERATURE'){
    if((37 <= parseInt(data, 10)) && (parseInt(data, 10)<= 37.9)){
      dataDiv.innerHTML =  '<div class="goodAlert"></div>' + data + '</p>';
    }else{
      dataDiv.innerHTML =  '<div class="badAlert"></div>' + data + '</p>';
    }
  }
  if(getContainerName(containerId)==='ACCELEROMETER'){
    if((0 <= parseInt(data, 10)) && (parseInt(data, 10)<= 4)){
      dataDiv.innerHTML =  '<div class="goodAlert"></div>' + data + '</p>';
    }else{
      dataDiv.innerHTML =  '<div class="badAlert"></div>' + data + '</p>';
    }
  }
  
  containerDataDiv.appendChild(dataDiv);
}; 