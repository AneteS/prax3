#!/usr/bin/python
# -*- coding: utf-8 -*-

import cgi,cgitb,sys,random,time
from random import shuffle

cgitb.enable()
formdata = cgi.FieldStorage()

print "Content-type: text/html\n\n"

#HTML lehe avamine
try:
	f = open('../prax3/index.html', 'r')
	template = f.read()
	f.close()
except:
	print "Faili ei saanud lugeda."
	sys.exit()
	
# Lehtede vahetus
if formdata.has_key("page"):
	page = formdata['page'].value
	if page == "index":
		try:
			f = open('../prax3/index.html', 'r')
			template = f.read()
			f.close()
		except:
			print "Faili ei saanud lugeda."
			sys.exit()
		
	if page == "results":
		try:
			f = open('../prax3/results.html', 'r')
			template = f.read()
			f.close()
		except:
			print "Faili ei saanud lugeda."
			sys.exit()
		if formdata.has_key("search"):
			search = formdata["search"].value
		else:
			search = ""
            

    # Tulemuste tabeli ja otsingu koostamine
		results = ""
		try:
			lines = [line.strip() for line in open("../prax3/tulemused.txt")]
		except:
			template = template.replace("$allResults$",  "Tulemuste faili ei saanud lugeda")
			sys.exit()
		lines = [line.split() for line in lines]
		if len(search) == 0:
			results = "<div id='all-results' class='jumbotron'><table id='allScoreTable' class='table table-striped table-hover table-condensed'>"
			results += "<tr><th><u>Name</u></th><th><u>Date</u></th><th><u>Board</u></th><th><u>Ships</u></th><u>User Fired</u></th><u>Computer Fired</u></th><u>Winner</u></th></tr>"
			for line in reversed(lines):
				results += "<tr><th>" + line[0] + "</th><th>" + line[1] + "</th><th>" +  line[2] + "</th><th>" + line[3] + "</th><th>" + line[4] + "</th><th>" + line[5] + "</th><th>" + line[6] + "</th><th>" + line[7] "</th></tr>"
			results += "</table></div>"
			template = template.replace("$allResults$", results)	
		else:
			results =  "<div id='all-results' class='jumbotron'><table id='allScoreTable' class='table table-striped table-hover table-condensed'>"
			results += "<tr><th><u>Name</u></th><th><u>Date</u></th><th><u>Board</u></th><th><u>Ships</u></th><u>User Fired</u></th><u>Computer Fired</u></th><u>Winner</u></th></tr>"
			for line in reversed(lines):
				if line[0] == search:
					results += "<tr><th>" + line[0] + "</th><th>" + line[1] + "</th><th>" +  line[2] + "</th><th>" + line[3] + "</th><th>" + line[4] + "</th><th>" + line[5] + "</th><th>" + line[6] + "</th><th>" + line[7] "</th></tr>"
			results += "</table></div>"
			template = template.replace("$allResults$", results)	
			
            

# Andmete salvestamine
if formdata.has_key("op"):
	op = formdata['op'].value
	if op == "save":
		if formdata.has_key("name"):
			name = formdata["name"].value
		if formdata.has_key("date"):
			date = formdata["date"].value
		if formdata.has_key("board"):
			board = formdata["board"].value
        if formdata.has_key("ships"):
			ships = formdata["ships"].value
        if formdata.has_key("userFired"):
			userFired = formdata["userFired"].value
		if formdata.has_key("computerFired"):
			computerFired = formdata["computerFired"].value
        if formdata.has_key("winner"):
			winner = formdata["winner"].value
		if formdata.has_key("name") and formdata.has_key("date") and formdata.has_key("board") and formdata.has_key("ships") and formdata.has_key("userFired") and formdata.has_key("computerFired") and formdata.has_key("winner"):
				eMsg = "false"
				template = template.replace("$errorMsg$", eMsg)
				try:
					f = open("../prax3/tulemused.txt", "a")
					f.write(name + "\t" + date + "\t" + board + "\t" + ships + "\t"+ userFired + "\t"+ computerFired + "\t" + winner + "\n")
					f.close()
				except:
					print "Faili ei saanud kirjutada."
					sys.exit()
			else:
				eMsg = "true"
				template = template.replace("$errorMsg$", eMsg)
