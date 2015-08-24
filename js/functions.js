// html structures
function load_txt(url){
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET",url,false);
    xmlhttp.send();
    var s = xmlhttp.responseText; 
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
function write_publications(){
    document.write('<ul class="list-unstyled">');
    // get data from publications.json
    var publications = JSON.parse(load_txt('./json/publications.json')); 
    var N = publications.length
    for (i=0;i<N;i++)
    { 
        if (i%2==0){
         document.write('<li style="margin:0 0 1em; padding:0 5px">');   
        }else{
            document.write('<li style="margin:0 0 1em; padding:0 5px; background-color:#F4F4F4">');
        }
        var author = publications[i].author;
        var year = publications[i].year;
        var title = publications[i].title;
        var journal = publications[i].journal;
        var volume = publications[i].volume;
        var number = publications[i].number;
        var page = publications[i].page;
        var url = publications[i].url;
        var dburl = publications[i].dburl;
        var bibString = '<span class="label label-default">' + (N-i).toString() + '</span> ' + author + ' (' + year +'): <span class="text-capitalize">' + title + '</span>. <i>' + journal + '</i>, <b>' + volume + '</b>, ' + page + '. <a href="' + url + '"><span class="glyphicon glyphicon-new-window"></span></a>&nbsp;&nbsp;<a href="'+dburl+'"><span class="glyphicon glyphicon-download-alt"></span></a>';
        document.write(bibString);
        document.write('</li>');
    	}
    document.write('</ul>');
}

// display journal feeds
function write_feeds(feeds_name,self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var i;
    document.write('<ul class="list-unstyled">');
    json_file = convert2depth('./json/journals/' + feeds_name + '.json',self_depth)
    var s = load_txt(json_file);
    var feeds = JSON.parse(s); 
    var N = feeds.length
    for (i=0;i<N;i++)
    { 
        // if (i%2==0){
//          document.write('<li style="margin:0 0 1em; padding:5px">');
//         }else{
//             document.write('<li style="margin:0 0 1em; padding:0 5px; background-color:#F4F4F4">');
//         }
        document.write('<li style="margin:0 0 1em; padding:5px">');  
        var author = feeds[i].author;
        if (author==''){
            author = 'Unknown';
        }
        var date = feeds[i].date;
        var title = feeds[i].title;
        var url = feeds[i].link;
        var description = feeds[i].description;
        var journal = feeds[i].journal
        var feedString = '<div><span class="label label-default">' + (N-i).toString() + '</span> <a target="_blank" href="' + url + '" class="text-capitalize">' + title + '</a></div> \
        <div class="text-muted "><i>' + journal + '</i><span class="pull-right">' + date + '</span></div>\
        <div class="toggle-switch border-bottom" style="cursor:pointer;">' + author + ' <span class="pull-right"><b class="caret"></b></span></div>'
        document.write(feedString);
        document.write('<div class="description" style="display:none;">' + description + '</div>')
        document.write('</li>');
    	}
    document.write('</ul>');
}
function get_num_of_feeds_by_journal(name_short,self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var json_file = convert2depth('./json/journals/' + name_short + '.json',self_depth);
    var s = load_txt(json_file);
    var feeds = JSON.parse(s); 
    var N = feeds.length
    return N.toString()
}
function get_journals(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var json_file = convert2depth('./json/journals.json',self_depth);
    var s = load_txt(json_file);
    var journals = JSON.parse(s);
    return journals
}
function write_journal_nav_list(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var i;
    var journals = get_journals(self_depth);
    var N = journals.length;
    
    for (i=0;i<N;i++){
        var s_short = journals[i].name_short;
        var s_long = journals[i].name_long;
        document.write('<li>' + '<a href="#' + s_short + '" class="text-uppercase"><span class="label label-primary">' + (N-i).toString() + '</span> ' + s_short + '<span class="badge">' + get_num_of_feeds_by_journal(s_short,self_depth) + '</span></a></li>')
    }
}
function write_journal_rss_list(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var journals = get_journals(self_depth);
    var N = journals.length;
    
    for (i=0;i<N;i++){
        var s_short = journals[i].name_short;
        var s_long = journals[i].name_long;
        document.write('<div id="' + s_short + '">');
        document.write('<h3 class="color-title">' + s_long + '</h3>');
        write_feeds(s_short,self_depth);
        document.write('</div>');
    }
}
function write_update_time(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var json_file = convert2depth('./json/journals/update_time.json',self_depth);
    var s = load_txt(json_file);
    var datetime = JSON.parse(s).datetime; 
    document.write(datetime)
}
function load_topics(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var json_file = convert2depth('./json/topics.json',self_depth);
    var s = load_txt(json_file);
    var topics = JSON.parse(s);
    return topics
}
function get_num_of_feeds_by_topics(topic_name,self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    topic_name = topic_name.replace(' ','_');
    var json_file = convert2depth('./json/topics/' + topic_name + '.json',self_depth);
    var s = load_txt(json_file);
    var feeds = JSON.parse(s); 
    var N = feeds.length
    return N.toString()
}
function write_reading_nav_by_topics(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var i;
    var topics = load_topics(self_depth);
    var N = topics.length;
    
    for (i=0;i<N;i++){
        var s_name = topics[i].name;
        var s_id = s_name.replace(' ','_');
        document.write('<li><a href="#' + s_id + '">' + s_name + ' <span class="badge">' + get_num_of_feeds_by_topics(s_name,self_depth) + '</span></a></li>')
    }
}
function write_feeds_by_topics(topic_name,self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var s_name = topic_name.replace(' ','_');
    var i;
    document.write('<ul class="list-unstyled">');
    json_file = convert2depth('./json/topics/' + s_name + '.json',self_depth)
    var s = load_txt(json_file);
    var feeds = JSON.parse(s); 
    var N = feeds.length
    for (i=0;i<N;i++)
    { 
        // if (i%2==0){
//          document.write('<li style="margin:0 0 1em; padding:5px">');
//         }else{
//             document.write('<li style="margin:0 0 1em; padding:0 5px; background-color:#F4F4F4">');
//         }
        document.write('<li style="margin:0 0 1em; padding:5px">');  
        var author = feeds[i].author;
        if (author==''){
            author = 'Unknown';
        }
        var date = feeds[i].date;
        var title = feeds[i].title;
        var url = feeds[i].link;
        var description = feeds[i].description;
        var journal = feeds[i].journal
        var feedString = '<div><span class="label label-default">' + (N-i).toString() + '</span> <a target="_blank" href="' + url + '" class="">' + title + '</a></div> \
        <div class="text-muted "><i>' + journal + '</i><span class="pull-right">' + date + '</span></div>\
        <div class="toggle-switch border-bottom"  style="cursor:pointer">' + author + '<span class="pull-right"><b class="caret"></b></span></div>'
        document.write(feedString);
        document.write('<div class="description" style="display:none;">' + description + '</div>')
        document.write('</li>');
    	}
    document.write('</ul>');
}
function write_reading_list_by_topics(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var topics = load_topics(self_depth);
    var N = topics.length;
    
    for (i=0;i<N;i++){
        var s_name = topics[i].name;
        var s_id = s_name.replace(' ','_');
        document.write('<div  id="' + s_id + '">');
        document.write('<h3 class="color-title">' + s_name + '</h3>');
        write_feeds_by_topics(s_name,self_depth);
        document.write('</div>');
    }
}
