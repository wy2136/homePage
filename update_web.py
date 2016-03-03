#! /usr/bin/env python
import os

# get the current CV
cmd = 'rsync -av /Users/yang/Dropbox/Work/myCV/CV_Wenchang_Yang.pdf /Users/yang/Dropbox/Public/wyang_ess_uci/cv_yang.pdf'
print('\nCV:' + '-'*20)
os.system(cmd)


# rsync to ess.uci
cmd = 'rsync -av --progress --exclude __pycache__ --exclude "history" --exclude update_journals --exclude update_journals.py --exclude=json/journals --exclude=json/topics --exclude=json/archive --exclude=json/.DS_Store --exclude=.git  /Users/yang/Dropbox/Public/wyang_ess_uci/ wenchay@home.ps.uci.edu:~/public_html/'
print('\nWeb:' + '-'*20)
os.system(cmd)