/* creation of delete function */
const all_items = document.querySelectorAll('.fa');
const all_div = document.querySelectorAll('.particular_div');
for(let i=0;i<all_items.length;i++)
  
all_items[i].addEventListener("click",function deletes(){
    all_div[i].remove();
    window.open('it'+i+'em',"_self");
});
