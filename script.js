var contract = new caver.klay.Contract(ABI, "0xEC694df0edbd898326366f4964ced10185F33536");

var from;

async function getFrom() {
    from = (await caver.klay.getAccounts())[0];
    if (from === undefined) {
        await klaytn.enable();
        from = (await caver.klay.getAccounts())[0];
    }
}

async function getRemains() {
    $("#remains").text("남은 수량 " + await contract.methods.limit().call() + "개");
}

if (window.klaytn !== undefined && window.caver !== undefined) {
    getFrom();
    getRemains();
} else if (confirm("카이카스가 설치되어 있지 않습니다. 카이카스를 설치하시겠습니까?")) {
    location.href = "https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi?hl=ko";
}

async function minting() {
    var remains = parseInt(await contract.methods.limit().call());
    var count = parseInt($("#count").val());
    count = isNaN(count) === true ? 1 : count;
    if (remains == 0) {
        alert("민팅이 진행중이 아닙니다");
    } else if (count > remains) {
        alert(remains + "개 남았습니다. 다시 시도해주세요");
    } else {
        var value = (59 * count) + "000000000000000000";
        await contract.methods.mint(count).send({ value: value, from: from, gas: 1500000 });
        alert(count + "개 민팅했습니다. 환영합니다!");
        location.reload();
    }
}
