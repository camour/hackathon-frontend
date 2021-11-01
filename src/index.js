//chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
const getData = () => {
  fetch("http://172.20.10.2:8282/~/mn-cse/cin-273837532",{
    method: 'GET',
    headers: {
      'X-M2M-Origin': 'admin:admin',
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
    document.getElementById('products').value = JSON.stringify(result);
    console.log(result);
  })
  .catch(error => {
    console.log(error);
  });
};

document.getElementById('getDataButton').addEventListener('click', function(event){
  getData();
}); 

addEventListener('load', async () => {
  let sw = await navigator.serviceWorker.register('/sw.js');
  console.log('service worker registered locally : ');
  console.log(sw);
  console.log(" ");
});

document.getElementById('subscribeButton').addEventListener('click', async () => {
  let sw = await navigator.serviceWorker.ready;
  let push = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'BIp2B5Iwb-uy3RLwo8E5RJwRW2CYv16g5ip3Y4zoGr9fHEGl4MAQbkkU_1wGyJS6ZzZPxe3KjgPSAvPs__mwoRM'
  });
  console.log('push subscription sent to server :');
  console.log(JSON.stringify(push));

  fetch("http://localhost:3000/subscription", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(push)
  })
  .then(result => {
    if(result.ok){
      return result.json();
    }
  })
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });

});

const navigatorBroadcast = new BroadcastChannel('count-channel');
navigatorBroadcast.onmessage = (event) => {
  document.getElementById('datas').innerHTML = 'test';
};