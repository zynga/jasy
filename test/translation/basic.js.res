function wrapper(){alert("Hallo Welt");
alert("Kurz");
alert("Danke f\u00fcr die Blumen");
alert("Guten Morgen");
alert("Guten Morgen! Morgen!");
alert("Guten "+this.computeGreeting()+"! "+this.computeGreeting()+"!");
alert("Unterhaltung");
alert("Unterhaltung Online");
alert("Unterhaltung "+this.getChatStatus());
alert(newMails<=1?"Sie haben eine neue Mail":"Sie haben neue Mails");
alert(newMails<=1?"Sie haben eine neue Mail":"Sie haben "+(newMails+1)+" neue Mails")}
