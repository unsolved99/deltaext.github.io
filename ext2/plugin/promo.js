
$(()=>{
    if(location.href.indexOf('dev')>-1) return;
     return;
    var now = new Date;
    var nowUTC = Date.UTC(now.getFullYear(),now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())
    // if(1633901101054 < nowUTC) return;
    $(document.body).append(
        $(`
        <div id="rekmodal" style="display:none">
            <div
            style="background: #FFF;
            margin-bottom: 10px;
            position: absolute;
            right: -8px;
            top: -8px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            border: 0;
            color: #a9a9a9;
            text-align: center;
            line-height: 30px;"
            data-iziModal-closeButton="true" id="rekclose" class="icon-close">X</div>
            <a style="display:flex;" id="reklink" onclick="return false" href="" target="_blank">
                <img style="width:100%" src="./assets/deltaservers.png">
            </a>
        </div>
        `)
        )
        
        $("#rekmodal").iziModal({
            autoOpen: 1,
        });
    
        $('#reklink').on('click',()=>{
            $('#rekmodal').iziModal('open')
        })
        $('#rekclose').on('click',()=>{
            $('#rekmodal').iziModal('close')
        })
    
        
        !(location.href.indexOf('de1v')>-1)&&setTimeout(()=>{$('#rekmodal').iziModal('open')},2000)



})
