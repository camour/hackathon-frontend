if(JSON.parse(localStorage.getItem('identifiers'))){
  // if we are already logged in, no need to ask for the user to loggin a second time
  document.getElementsByClassName('form')[0].style.display = "none" ;
}else{
  localStorage.clear();
  document.getElementsByTagName('main')[0].style.display = "none" ;
}

// right after the web page is loaded, we create a service worker (sw)
// in fact, a webclient does not have the capabilty to listen to notifications,
// so we use service worker. Here we just create the service worker but we did not
// set everything up like secrets keys that are important in notification system communication (see tools.js)
addEventListener('load', async () => {
  let sw = await navigator.serviceWorker.register('/sw.js');
  console.log(sw);
  processToMonitorConstruction();
});

document.getElementById('formSubmitButton').addEventListener('click', connect);

//we create a channel between the navigator and the service worker so whenever the service receives a notification from
// our server node, the service worker would warn our navigator
const navigatorBroadcast = new BroadcastChannel('count-channel');
navigatorBroadcast.onmessage = (event) => {
  let payload = JSON.parse(event.data.payload);
  let containerId = payload.pi.split('mn-cse/')[1];
  let containerDiv = document.getElementById('containerDiv'+ containerId);
  let containerDataDiv = document.getElementById('containerDataDiv'+ containerId);
  containerDataDiv.innerHTML = '';
  let dataDiv = document.createElement('div');
  dataDiv.classList.add('dataDiv');
  let data = payload.con.split('=\"')[2].split('"')[0];
  if(getContainerName(containerId)==='TEMPERATURE'){
    if((32 <= parseInt(data, 10)) && (parseInt(data, 10)<= 38)){
      dataDiv.innerHTML =  '<div class="goodAlert"></div>' + data + ' ° Celsius</p>';
    }else{
      dataDiv.innerHTML =  '<div class="badAlert"></div>' + data + ' ° Celsius</p>';
    }
  }
  if(getContainerName(containerId)==='ACCELEROMETER'){
    if((0 <= parseInt(data, 10)) && (parseInt(data, 10)<= 9.9)){
      dataDiv.innerHTML =  '<div class="goodAlert"></div>' + data + ' m/s.s</p>';
    }else{
      dataDiv.innerHTML =  '<div class="badAlert"></div>' + data + ' m/s.s</p>';
    }
  }
  
  containerDataDiv.appendChild(dataDiv);
}; 


document.getElementById('logout').addEventListener('click', function(event){
    fetch(SERVER_NODE + 'logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: localStorage.getItem('identifiers')
    })
    .then(result => {
      if(result.ok){
        return result.json();
      }
    })
    .then(result => {
      localStorage.clear();
      document.location.replace('http://localhost');
    })
    .catch(error => {
      console.log(error);
    });    
})