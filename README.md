JsStore is a plugin I am currently working on, to extend some of 
the libraries in jQuery UI. I have come across a certian issue many times, where 
you need to use active UI functions such as sotable, and dragable, but also
need to preserve the state of this functionality for the end user client side. 
Though there are many ways you could write a solution for this, I decided to make 
life a little easier [hence a plugin], and make a simple pluign to do this for us developers.
    
    The plugin is still in the first phase of development, but should be coming along soon. I
plan on making this plugin check for the localStorage functionality, and if not able, then it uses
cookie storage as a back up. It is being set up to work along side jQuery.sortable(), but will 
then be extended to other UI methods. The plugin is also being written to need minimal intervention
to get it working smoothly with your current application. This meaning, it dynamically adds
attributes to the selectors of each sortable method call, so that the content is trackable. 

   If you have any suggestions, please contact me @ caseypharr@outlook.com. I would love to 
have any user feedback and ideas for this project. Since I currently am a developer fulltime
in my proffesional life, I am not able to partition a majority of my time to this porject. I will
however, try my best to keep updating, and progressing this plugin until it is completed.

  Thanks, and I hope this contributes to the open source community. When It is completed, I will create a Demo/API 
  document for it's use.  Happy coding :)
