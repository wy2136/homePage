// html structures
function load_txt(url){
    var xmlhttp;
    if (window.XMLHttpRequest){
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }else{// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET",url,false);
    xmlhttp.send();
    var s = xmlhttp.responseText;
    // var xmlhttp;
    // if (window.XMLHttpRequest)
    //   {// code for IE7+, Firefox, Chrome, Opera, Safari
    //   xmlhttp=new XMLHttpRequest();
    //   }
    // else
    //   {// code for IE6, IE5
    //   xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    //   }
    // xmlhttp.onreadystatechange=function()
    //   {
    //   if (xmlhttp.readyState==4 && xmlhttp.status==200)
    //     {
    //     s = xmlhttp.responseText;
    //     }
    //   }
    // xmlhttp.open("GET","ajax_info.txt",true);
    // xmlhttp.send();
    return s
}
function convert2depth(s,self_depth){
    if (self_depth==1){
        s = s;
    }else if (self_depth==2){
        s = s.replace(/\.\//g,'../');
    }else if (self_depth==3){
        s = s.replace(/\.\//g,'../../');
    }else {
        s = "Current html file is in depth greater than 3. Please modify the file convert2depth function in /js/functions.js!";
    }
    return s;
}
function write_html(url,self_depth){
    if (typeof(self_depth)==='undefined') {
        self_depth = 1;
    }
    var s = load_txt(url);
    s = convert2depth(s,self_depth)
    document.write(s);
}
function write_head(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var s;
    var url = './slices/head.html';
    url = convert2depth(url,self_depth);
    s = load_txt(url);
    s = convert2depth(s,self_depth);

    document.write(s)   
}
function write_navbar(self_depth,active_item){
    if (typeof(active_item)==='undefined'){
        active_item = "#";
    }
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var s;
    var url = './slices/navbar.html';
    url = convert2depth(url,self_depth);
    s = load_txt(url);
    s = convert2depth(s,self_depth);
    
    // Make the item in the navbar active
    if (active_item=='home'){
        s1 = convert2depth('<li><a href="./index.html">',self_depth);
        s2 = convert2depth('<li class="active"><a href="./index.html">',self_depth);
        s = s.replace(s1,s2)
    }else if (active_item=='cv'){
        s1 = convert2depth('<li><a href="./cv.html">',self_depth);
        s2 = convert2depth('<li class="active"><a href="./cv.html">',self_depth);
        s = s.replace(s1,s2)
    }else if (active_item=='research'){
        s1 = convert2depth('<li><a href="./research.html">',self_depth);
        s2 = convert2depth('<li class="active"><a href="./research.html">',self_depth);
        s = s.replace(s1,s2)
    }else if (active_item=='publications'){
        s1 = convert2depth('<li><a href="./publications.html">',self_depth);
        s2 = convert2depth('<li class="active"><a href="./publications.html">',self_depth);
        s = s.replace(s1,s2)
    }else if (active_item=='reading'){
        s1 = convert2depth('<li><a href="./reading.html">',self_depth);
        s2 = convert2depth('<li class="active"><a href="./reading.html">',self_depth);
        s = s.replace(s1,s2)
    }else if (active_item=='about_me'){
        s1 = convert2depth('<li><a href="./about_me.html">',self_depth);
        s2 = convert2depth('<li class="active"><a href="./about_me.html">',self_depth);
        s = s.replace(s1,s2)
    }
    else if (active_item=='programming'){
            s1 = convert2depth('<li><a href="./programming.html">',self_depth);
            s2 = convert2depth('<li class="active"><a href="./programming.html">',self_depth);
            s = s.replace(s1,s2)
        }
    document.write(s)   
}
function write_footer(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var s;
    var url = './slices/footer.html';
    url = convert2depth(url,self_depth);
    s = load_txt(url);
    s = convert2depth(s,self_depth);

    document.write(s)   
}
function write_copyright(){
    var d = new Date();
    var year = d.getFullYear();
    document.write('&copy; '  + year + ' Wenchang Yang')
}
function write_jobs(){
    document.write('<ul class="list-unstyled">');
    // get data from publications.json
    var jobs = JSON.parse(load_txt('jobs.json')); 
    var N = jobs.length
    for (i=0;i<N;i++){  
        var myStatus = jobs[i].status; 
        var title = jobs[i].title;
        var institution = jobs[i].institution;
        var department = jobs[i].department;
        var deadline = jobs[i].deadline;
        var link = jobs[i].link;
        var requirements = jobs[i].requirements;
        var description = jobs[i].description;
        document.write('<li class="well" style="margin-bottom:1em">');
        // job head
        if (myStatus=='applied'){
            var s = '<span class="label label-default">' + (N-i).toString() + '</span><span class="text-muted"> ' + deadline + ': </span> <a href="' + link + '">' + title + '</a>'
        }else{
            var s = '<span class="label label-default">' + (N-i).toString() + '</span><span class="color-title"> ' + deadline + ': </span> <a href="' + link + '">' + title + '</a>'
        }
        document.write(s);
        // job details
        document.write('<ul>');
        document.write('<li><strong>' + institution + '</strong></li>');
        document.write('<li>' + department + '</li>');
        document.write('<li>Requirements</li>');
        document.write('<ul>');
        document.write('<li>' + requirements + '</li>')
        document.write('</ul>');
        document.write('<li class="btn btn-default btn-click">Details</li>');
        document.write('<ul class="description" style="display:none">');
        document.write('<li class="text-muted">' + description + '</li>');
        document.write('</ul>');
        document.write('</ul>');
        document.write('</li>');
    }
    document.write('</ul>');
}

