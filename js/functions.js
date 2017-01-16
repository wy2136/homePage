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
        var page = publications[i].page;
        var doi = publications[i].doi;
        if (doi=='N/A'){
            var url = "#";
        }else{
            var url = " http://dx.doi.org/" + doi;
        }
        // var dburl = publications[i].dburl;
        var pdffile = publications[i].pdffile
        var bibString = '<span class="label label-default">' + (N-i).toString() + '</span> ' + author + ' (' + year +'): <a href="' + url + '" class="">' + title + '</a>. <i>' + journal + '</i>, <b>' + volume + '</b>, ' + page + ', doi: <span  class="text-muted">' + doi + '</span>, <a href="'+pdffile+'" class="text-muted"><span class="glyphicon glyphicon-download-alt"></span></a>';
        document.write(bibString);
        document.write('</li>');
    	}
    document.write('</ul>');
}

// display journal feeds
function get_html_feeds_ul(feeds){
    var N = feeds.length;
    var html = '';
    for (i=0;i<N;i++){
        html += '<li style="margin:0 0 1em; padding:5px">';
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
        <div class="toggle-switch border-bottom" style="cursor:pointer;">' + author + ' <span class="glyphicon glyphicon-menu-right text-muted pull-right"></span></div>'
        html += feedString;
        html += '<div class="description text-muted" style="display:none;">' + description + '</div>';
        html += '</li>';
    }
    return html
}
// by journal
function load_journals(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var json_file = convert2depth('./json/journals.json',self_depth);
    var s = load_txt(json_file);
    var journals = JSON.parse(s);
    return journals
}
function load_journals_meta(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var json_file = convert2depth('./json/journals/meta_journals.json',self_depth);
    var s = load_txt(json_file);
    var meta = JSON.parse(s);
    return meta
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
function write_journal_nav_list(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var i;
    var journals = load_journals(self_depth);
    var N = journals.length;

    for (i=0;i<N;i++){
        var s_short = journals[i].name_short;
        var s_long = journals[i].name_long;
        document.write('<li>' + '<a href="#' + s_short + '" class=""><span class="label label-primary">' + (N-i).toString() + '</span> ' + s_long + '<span class="badge">' + get_num_of_feeds_by_journal(s_short,self_depth) + '</span></a></li>')
    }
}
function get_html_journal_list(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var i;
    var journals = load_journals(self_depth);
    var meta = load_journals_meta(self_depth);
    var N = journals.length;

    var html = '';
    for (i=0;i<N;i++){
        var s_short = journals[i].name_short;
        var s_long = journals[i].name_long;
        html += '<li class="journal_name well" style="font-size:1.1em; cursor:pointer; margin-bottom:0;" id="' + s_short + '">' + '<span class="label label-primary">' + (N-i).toString() + '</span> ' + s_long + ' <span class="badge alert-info">' + meta[s_short]['count'] + '</span><span class="glyphicon glyphicon-menu-right text-muted pull-right"></span></li>';
        html += '<p class="journal_content"></p>';
    };
    return html
}
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
        var feedString = '<div><span class="label label-default">' + (N-i).toString() + '</span> <a target="_blank" href="' + url + '" class="">' + title + '</a></div> \
        <div class="text-muted "><i>' + journal + '</i><span class="pull-right">' + date + '</span></div>\
        <div class="toggle-switch border-bottom" style="cursor:pointer;">' + author + ' <span class="pull-right"><b class="caret"></b></span></div>'
        document.write(feedString);
        document.write('<div class="description" style="display:none;">' + description + '</div>')
        document.write('</li>');
    	}
    document.write('</ul>');
}
function get_html_feeds_by_journal(name_short,self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var i;
    var journals = load_journals(self_depth);
    var N = journals.length;
    for (i=0;i<N;i++){
        var s_short = journals[i].name_short;
        if (s_short == name_short){
            var name_long = journals[i].name_long;
            break;
        }
    }
    var html = ''
    html += '<div id="' + name_short + '">';
    html += '<h3 class="color-title" style="padding-left:0.5ex;">' + name_long + '</h3>';

    html += '<ul class="list-unstyled">';
    json_file = convert2depth('./json/journals/' + name_short + '.json',self_depth)
    var s = load_txt(json_file);
    var feeds = JSON.parse(s);
    html += get_html_feeds_ul(feeds);
    html += '</ul>';
    html += '</div>';
    return html
}
function write_journal_rss_list(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var journals = load_journals(self_depth);
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
// by topics
function load_topics(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var json_file = convert2depth('./json/topics.json',self_depth);
    var s = load_txt(json_file);
    var topics = JSON.parse(s);
    return topics
}
function load_topics_meta(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var json_file = convert2depth('./json/topics/meta_topics.json',self_depth);
    var s = load_txt(json_file);
    var meta = JSON.parse(s);
    return meta
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
function get_html_topic_list(self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var i;
    var topics = load_topics(self_depth);
    // topics.push({"name":"Misc", "keywords":"N/A"});
    topics.unshift({"name":"Misc", "keywords":"N/A"});
    var meta = load_topics_meta(self_depth);
    meta['byPeople'] = {'count': get_num_of_feeds_by_topics('byPeople', self_depth)};
    var N = topics.length;

    var html = '';
    for (i=0;i<N;i++){
        var s_name = topics[i].name;
        var s_id = s_name.replace(' ','_');
        if (s_id == "Misc"){
            s_id = "byPeople";
        }
        html += '<li class="topic_name well" style="font-size:1.1em; cursor:pointer; margin-bottom:0;" id="' + s_id + '">' + '<span class="label label-primary">' + (N-i).toString() + '</span> ' + s_name + ' <span class="badge alert-info">' + meta[s_id]['count'] + '</span><span class="glyphicon glyphicon-menu-right text-muted pull-right"></span></li>';
        html += '<p class="topic_content"></p>';
    };
    return html
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
function get_html_feeds_by_topic(topic_id,self_depth){
    if (typeof(self_depth)==='undefined'){
        self_depth = 1;
    }
    var topic_name = topic_id.replace('_',' ');
    if (topic_name == "byPeople"){
        topic_name = "Misc"
    }

    var html = ''
    html += '<div>';
    html += '<h3 class="color-title" style="padding-left:0.5ex;">' + topic_name + '</h3>';

    html += '<ul class="list-unstyled">';
    json_file = convert2depth('./json/topics/' + topic_id + '.json',self_depth)
    var s = load_txt(json_file);
    var feeds = JSON.parse(s);
    html += get_html_feeds_ul(feeds);
    html += '</ul>';
    html += '</div>';
    return html
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
