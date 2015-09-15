#!/usr/bin/env python
# -*- coding: utf-8 -*-
# 
# Written by Wenchang Yang (yang.wenchang@uci.edu)
# 
from __future__ import print_function

import json
from lxml import etree, html
import datetime
import os
import time
import requests

# functions to be used by other higher level functions
def load_json(json_file,**kwargs):
    '''load json file.'''
    with open(json_file) as f:
        json_var = json.load(f,**kwargs)
    return json_var
def get_html_text_from_url(url):
    '''Get the html text given the url.'''
    return requests.get(url).text
def get_month(Xxx):
    '''Transform alphabetic-form month into digit form, e.g. 'Jan' to '01'. '''
    d = {'Jan':'01',
        'Feb':'02',
        'Mar':'03',
        'Apr':'04',
        'May':'05',
        'Jun':'06',
        'Jul':'07',
        'Aug':'08',
        'Sep':'09',
        'Oct':'10',
        'Nov':'11',
        'Dec':'12'
        }
    return d[Xxx]
def update_date(date_old):
    '''Normalize the date format as yyyy-mm-dd. '''
    ds = date_old.split()
    if len(ds)>1:
        dd = ds[1]
        mm = get_month(ds[2])
        yyyy = ds[3]
    else:
        ds = date_old.split('-')
        dd = ds[2][0:2]
        mm = ds[1]
        yyyy = ds[0]
    date_new = '-'.join([yyyy,mm,dd])
    return date_new
# 
# retrive rss feeds from the web, and save them into json files
def load_journals(dir_home):
    '''load journals as a list of dictionary from json/journals.json'''
    with open(dir_home + 'json/journals.json') as f:
        journals = json.load(f)
    return journals
def retrieve_rss_to_json(dir_home):
    '''For each journal, download the rss feeds and save to a json file.'''
    # load journals as a list of dictionary from json/journals.json
    journals = load_journals(dir_home)
    N = len(journals)
    # retrive rss as a dict for each journal
    for i,journal in enumerate(journals,start=1):
        print (i,'of',N,':',journal['name_long'],'...')
        # connect to the rss server
        r = requests.get(journal['url_rss'])
        if r.ok is False:
            print ('\tFailed to connect to the server!')
            continue
        # read the rss feeds into dom
        dom = etree.XML(r.content)
        # parse the dom into items
        items = dom.xpath('//item')
        if len(items)==0:
            items = dom.findall('{http://purl.org/rss/1.0/}item')
        feeds = []
        for item in items:
            # parse relevant information from each item
            # author
            authors = item.xpath('author/text()')
            if len(authors)>0:
                author = authors[0]
                author = author[author.find('(')+1:]
            else:
                author = item.find('{http://purl.org/dc/elements/1.1/}creator')
                if author is None or author.text is None:
                    author = ''
                else:
                    author = author.text
            # title
            titles = item.xpath('title/text()')
            if len(titles)>0:
                title = titles[0]
            else:
                title = item.find('{http://purl.org/rss/1.0/}title')
                if title is None or title.text is None:
                    title = ''
                else:
                    title = title.text
            # link
            links = item.xpath('link/text()')
            if len(links)>0:
                link = links[0]
            else:
                link = item.find('{http://purl.org/rss/1.0/}link')
                if link is None or link.text is None:
                    link = ''
                else:
                    link = link.text
            # date
            dates = item.xpath('pubDate/text()')
            if len(dates)>0:
                date = dates[0]
            else:
                date = item.find('{http://purl.org/dc/elements/1.1/}date')
                if date is None or date.text is None:
                    date = ''
                else:
                    date = date.text 
            date = update_date(date)
            # description
            descriptions = item.xpath('description/text()')
            if len(descriptions)>0:
                description = descriptions[0]
            else:
                description = item.find('{http://purl.org/rss/1.0/}description')
                if description is None or description.text is None:
                    description = ''
                else:
                    description = description.text
            # in case the author is empty but included in the description
            if author=='' and 'Author(s): ' in description:
                i = description.find('Author(s): ')
                authorText = description[i+11:]
                j = authorText.find('<br')
                author = authorText[:j]
            
            # save the item into a dict
            feed = {
                'author': author,
                'title': title,
                'link': link,
                'description': description,
                'date': date,
                'journal': journal['name_long'],
                }
            feeds.append(feed)
        with open(dir_home + 'json/journals/' 
            + journal['name_short'] + '.json','w') as f_journal:
            json.dump(feeds,f_journal,indent=4,sort_keys=True)
def gen_updatetime_json(dir_home):
    '''Record the date and time when all the json file are generated.'''
    with open(dir_home + 'json/journals/update_time.json','w') as f_json:
        dt = {}
        dt['datetime'] = datetime.datetime.now().strftime('%b %d,  %Y %H:%M  ')\
            + time.strftime("%Z", time.gmtime())
        json.dump(dt,f_json,indent=4)
# 
# filter feeds according to topics or relevant people
def load_feeds(journal,dir_home):
    '''load feeds from a journal as a list of dictionaries. '''
    json_journal = os.path.join(
        dir_home,
        'json/journals',
        journal['name_short'] + '.json'
    )
    with open(json_journal) as f_feeds:
        feeds = json.load(f_feeds)
    return feeds
def load_people(dir_home):
    '''load people's names as a list of strings. '''
    with open(dir_home + 'json/people.json') as f:
        people = json.load(f)
    return people
def name_in_author_list(name,author_list):
    '''Condition whether a given name is in our author list.'''
    s = name.split()
    if len(s)==2:
        name_formats = [
            ' '.join(s),
            s[0][0] + '. ' + s[-1], 
            s[-1] + ', ' + s[0],
            s[-1] + ', ' + s[0][0] + '.'
        ]
    elif len(s)==3:
        name_formats = [
            ' '.join(s),
            s[0][0] + '. ' + s[1][0] + '. ' + s[-1],
            s[-1] + ', ' + s[0] + ' ' + s[1],
            s[-1] + ', ' + s[0][0] + '. ' + s[1][0] + '.'
        ]
    if len(set(name_formats) & set(author_list))>0:
        return True
    else:
        return False
def people_in_feed(people,feed):
    '''Condition if the feed includes one or more persons of interest.'''
    author_list = feed['author'].replace(', and ',', ').replace(' et al','').split(', ')
    if len(author_list)>4:
        author_list = author_list[0:1]
    L = False
    for name in people:
        L = L or name_in_author_list(name,author_list)
        if L is True:
            break
    return L
def load_topics(dir_home):
    '''load topics from json/topics/'''
    json_topics = os.path.join(dir_home, 'json/topics.json')
    with open(json_topics) as f:
        topics = json.load(f)
    return topics
def gen_reading_json(dir_home):
    print ('\n','Generate reading json files','...')
    # load journals
    journals = load_journals(dir_home)
    # initialize feeds of interest
    topics = load_topics(dir_home)
    feeds_by_topic = {}
    for topic in topics:
        feeds_by_topic[topic['name']] = []
    people = load_people(dir_home)
    feeds_of_authors_of_interest = []
    # save digest json
    for journal in journals:
        feeds = load_feeds(journal,dir_home)
        for feed in feeds:
            for topic in topics:
                des = feed['title'] + ' ' + feed['description']
                des_lower = des.lower()
                keywords = topic['keywords'].split(', ')
                topicIsRelevant = False
                for keyword in keywords:
                    if len(keyword)<5: #initials e.g. MJO, ENSO
                        topicIsRelevant =  topicIsRelevant or (keyword in des)
                    else:
                        kw = keyword.lower()
                        topicIsRelevant =  topicIsRelevant or (kw in des_lower)
                    if topicIsRelevant:
                        break
                if topicIsRelevant:
                    feeds_by_topic[topic['name']].append(feed)
            if people_in_feed(people,feed):
                feeds_of_authors_of_interest.append(feed)
    for topic in topics:
        with open(dir_home + 'json/topics/' + topic['name'].replace(' ','_') 
            + '.json','w') as f_json:
            feeds_sorted = sorted(feeds_by_topic[topic['name']],
                key=lambda feed: feed['date'], reverse=True)
            json.dump(feeds_sorted,f_json,indent=4,sort_keys=True)
    with open(dir_home + 'json/topics/byPeople.json','w') as f_json:
        feeds_sorted = sorted(feeds_of_authors_of_interest,
            key=lambda feed: feed['date'], reverse=True)
        json.dump(feeds_sorted,f_json,indent=4,sort_keys=True)
# 
# archive topics by year
def load_current_feeds_from_topic(topic_name, dir_home):
    '''Load the current feeds of a topic given the topic name. '''
    json_topic = os.path.join(
        dir_home,
        'json/topics',
        topic_name.replace(' ', '_') + '.json'
    )
    with open(json_topic) as f_feeds:
        feeds = json.load(f_feeds)
    return feeds
def archive_topic(topic_name, dir_home):
    '''Archive a topic to $dir_home/json/archive/topics/$topic_name.json. '''
    
    # create the topic archive folder if needed
    dir_topic = os.path.join(
        dir_home, 
        'json/archive/topics', 
        topic_name.replace(' ', '_')
    )
    if os.path.isdir(dir_topic):
        pass
    else:
        os.makedirs(dir_topic)
    # todo
    
    
    
def archive_topics(dir_home):
    pass
# 
# test functions
def test_journal(journal_short_name, dir_home='/Users/yang/Dropbox/Public/wyang_ess_uci/'):
    # get the tested journal
    journals = load_journals(dir_home)
    journal = [
        journal for journal in journals 
            if journal['name_short'] == journal_short_name
    ][0]
    print(journal['name_long'])
    print(journal['url_rss'])
    print('\n')
    
    r = requests.get(journal['url_rss'])
    if r.ok is False:
        print ('\tFailed to connect to the server!')
        return
    # read the rss feeds into dom
    dom = etree.XML(r.content)
    # parse the dom into items
    items = dom.xpath('//item')
    if len(items)==0:
        items = dom.findall('{http://purl.org/rss/1.0/}item')
    feeds = []
    for item in items:
        # parse relevant information from each item
        # author
        authors = item.xpath('author/text()')
        if len(authors)>0:
            author = authors[0]
            author = author[author.find('(')+1:]
        else:
            author = item.find('{http://purl.org/dc/elements/1.1/}creator')
            if author is None or author.text is None:
                author = ''
            else:
                author = author.text
        # title
        titles = item.xpath('title/text()')
        if len(titles)>0:
            title = titles[0]
        else:
            title = item.find('{http://purl.org/rss/1.0/}title')
            if title is None or title.text is None:
                title = ''
            else:
                title = title.text
        # link
        links = item.xpath('link/text()')
        if len(links)>0:
            link = links[0]
        else:
            link = item.find('{http://purl.org/rss/1.0/}link')
            if link is None or link.text is None:
                link = ''
            else:
                link = link.text
        # date
        dates = item.xpath('pubDate/text()')
        if len(dates)>0:
            date = dates[0]
        else:
            date = item.find('{http://purl.org/dc/elements/1.1/}date')
            if date is None or date.text is None:
                date = ''
            else:
                date = date.text 
        date = update_date(date)
        # description
        descriptions = item.xpath('description/text()')
        if len(descriptions)>0:
            description = descriptions[0]
        else:
            description = item.find('{http://purl.org/rss/1.0/}description')
            if description is None or description.text is None:
                description = ''
            else:
                description = description.text
        # in case the author is empty but included in the description
        if author=='' and 'Author(s): ' in description:
            i = description.find('Author(s): ')
            authorText = description[i+11:]
            j = authorText.find('<br')
            author = authorText[:j]
        
        # save the item into a dict
        feed = {
            'author': author,
            'title': title,
            'link': link,
            'description': description,
            'date': date,
            'journal': journal['name_long'],
            }
        print(title)
        print('\t', date)
        print('\t', author)
        print('\n')
    
    
# 
def main():
    start = time.time()
    # journals directory
    dir_home = '/Users/yang/Dropbox/Public/wyang_ess_uci/'
    if os.uname()[1]=='engey':
        dir_home = '/home/wenchay/Dropbox/Public/wyang_ess_uci/'
        
    #  retrieve rss feeds and save them into json files
    retrieve_rss_to_json(dir_home)
    gen_updatetime_json(dir_home)
    end = time.time()
    print (end - start,'s')
    start = end
    
    # generate the reading json files
    gen_reading_json(dir_home)
    end = time.time()
    print( end - start,'s')
    start = end

    # sync to web server
    os.system('rsync -av --progress ' + dir_home + 'json/journals/ '
        + 'wenchay@home.ps.uci.edu:~/public_html/json/journals/ ')
    os.system('rsync -av --progress ' + dir_home + 'json/topics/ '
        + 'wenchay@home.ps.uci.edu:~/public_html/json/topics/ ')
    end = time.time()
    print (end - start,'s')
if __name__=='__main__':
    main()