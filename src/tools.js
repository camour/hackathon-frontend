const connect = () => {
    let identifiers = {
        login: document.getElementById('login').value,
        password: document.getElementById('password').value
    };
    fetch('http://localhost:3000/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(identifiers)
    })
    .then(result => {
        if(result.ok){
            return result.json();
        }
    })
    .then(result => {        
        if(result.hasOwnProperty('identifiers') && result.hasOwnProperty('aeArray')){
            localStorage.setItem('identifiers', JSON.stringify(identifiers));
            localStorage.setItem('aeArray', JSON.stringify(result.aeArray));
        }
    })
    .then(async () => {
        let sw = await navigator.serviceWorker.ready;
        let push = await sw.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BIp2B5Iwb-uy3RLwo8E5RJwRW2CYv16g5ip3Y4zoGr9fHEGl4MAQbkkU_1wGyJS6ZzZPxe3KjgPSAvPs__mwoRM'
        });
        console.log('push subscription sent to server :');
        console.log(JSON.stringify(push));
        let checks = [];
        let aeArray = JSON.parse(localStorage.getItem('aeArray'));
        for(let ae of aeArray){
            for(let containerId of ae.containersArray){
                fetch("http://localhost:3000/subscription", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    containerId: containerId,
                    push: push,
                    identifiers: JSON.parse(localStorage.getItem('identifiers'))
                })
                })
                .then(result => {
                if(result.ok){
                    return result.json();
                }
                })
                .then(response => {
                    console.log(response);
                    checks.push(1);
                    if((checks.length === countContainers(aeArray)) && checks.every((currentvalue) => currentvalue===1)){
                        alert('checks.length equals number of containers !');
                        document.getElementsByClassName('form')[0].style.display = "none" ;
                        document.getElementsByTagName('main')[0].style.display = "block" ;
                    }               
                })
                .catch(error => {
                    console.log(error);
                });
            }
        }
      })
    .catch(error => {
        console.log(error);
    });
};

const countContainers = (aeArray) => {
    let result = 0;
    for(let ae of aeArray){
        for(let container of ae.containersArray){
            result++;
        }
    }
    return result;
}