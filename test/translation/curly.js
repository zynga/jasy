function wrapper()
{
  alert(this.tr("Hello World"));
  alert(tr("Short"));
  alert(qx.locale.Manager.getInstance().tr("Thank you for the flowers"));
  
  alert(tr("Guten {1}", "Morgen"))
  alert(tr("Guten {1}! {1}!", "Morgen"))
  alert(tr("Guten {1}! {1}!", this.computeGreeting()))

  alert(trc("Chat (noum)", "Chat"));
  alert(trc("Chat (noum) {1}", "Chat {1}", "Online"));
  alert(trc("Chat (noum) {1}", "Chat {1}", this.getChatStatus()));

  alert(trn("You have got a new mail", "You have got new mails", newMails));
  alert(trn("You have got a new mail", "You have got {1} new mails", newMails, newMails+1));
}

