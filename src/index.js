const containersArray = ['cnt-379667708', 'cnt-379667708'];

if(JSON.parse(localStorage.getItem('identifiers'))){
  document.getElementsByClassName('form')[0].style.display = "none" ;
}else{
  document.getElementsByTagName('main')[0].style.display = "none" ;
}
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

addEventListener('load', async () => {
  let sw = await navigator.serviceWorker.register('/sw.js');
  console.log('service worker registered locally : ');
  console.log(sw);
  console.log(" ");
});

document.getElementById('formSubmitButton').addEventListener('click', connect);

const navigatorBroadcast = new BroadcastChannel('count-channel');
navigatorBroadcast.onmessage = (event) => {
  document.getElementById('monitoringBlock').innerHTML = 'test';
}; 