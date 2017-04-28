#! /usr/bin/env python
import os

# get the current CV
cmd = 'rsync -av /Users/yang/Dropbox/Work/myCV/cv_yang/CV_Wenchang_Yang.pdf /Users/yang/Dropbox/Public/wyang_ess_uci/cv_yang.pdf'
print('\nCV:' + '-'*20)
os.system(cmd)
cmd = 'rsync -av /Users/yang/Dropbox/Work/myCV/cv_yang/CV_Wenchang_Yang_Chinese.pdf /Users/yang/Dropbox/Public/wyang_ess_uci/cv_yang_Chinese.pdf'
print('\nCV:' + '-'*20)
os.system(cmd)


# rsync to ess.uci
cmd = 'rsync -av --progress --exclude "__pycache__" --exclude "history" --exclude "update_journals" --exclude "*.py" --exclude="json/journals" --exclude="json/topics" --exclude="json/archive"  --exclude=".*"  /Users/yang/Dropbox/Public/wyang_ess_uci/ wenchay@home.ps.uci.edu:~/public_html/'
print('\nWeb:' + '-'*20)
os.system(cmd)
