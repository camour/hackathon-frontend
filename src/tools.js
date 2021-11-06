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
            for(let container of ae.containersArray){
                fetch("http://localhost:3000/subscription", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    containerId: container.containerId,
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
                        processToMonitorConstruction();                        
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

const processToMonitorConstruction = () => {
    let aeArray = JSON.parse(localStorage.getItem('aeArray'));
    if(!aeArray){
        return;
    }
    let monitor = document.getElementById('monitoringBlock');
    for(let ae of aeArray){
        let aeBlock = document.createElement('div');
        aeBlock.setAttribute('id', 'aeBlock' + ae.aeId);
        aeBlock.classList.add('aeBlock');

        let aeDiv = document.createElement('div');
        aeDiv.setAttribute('id', 'aeDiv' + ae.aeId);
        aeDiv.classList.add('aeDiv');
        aeDiv.innerHTML = '<p>' + ae.aeName + '<i class="fas fa-person-booth"></i></p>';

        let aeContainersDiv = document.createElement('div');
        aeContainersDiv.setAttribute('id', 'aeContainersDiv' + ae.aeId);
        aeContainersDiv.classList.add('aeContainersDiv');

        for(let container of ae.containersArray){
            let containerDiv = document.createElement('div');
            containerDiv.setAttribute('id', 'containerDiv' + container.containerId);
            containerDiv.classList.add('containerDiv');
            containerDiv.innerHTML = '<h6><p>'+container.containerName+'</p><div class="'+container.containerName+'_logo"></div></h6><div id="containerDataDiv'+ container.containerId +'"></div>';
            aeContainersDiv.appendChild(containerDiv);
        }

        aeBlock.appendChild(aeDiv);
        aeBlock.appendChild(aeContainersDiv);
        monitor.appendChild(aeBlock);     
    }
}

const getContainerName = (containerId) => {
    let aeArray = JSON.parse(localStorage.getItem('aeArray'));
    let result = null;
    for(let ae of aeArray){
        for(let container of ae.containersArray){
            if(container.containerId === containerId){
                result = container;
            }
        }
    }
    return result.containerName;
}