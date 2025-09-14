# imageKeepingAdmin
This will be a simple backend interface to keep track of the generated images. We will be able to make simple operations with the images from this admin.

Only logged in users will have access to the admin interface. We will have max 10 users but 1 user is a good start. 

Operations we will need: 
- list all the images from a directory. The directory is statically configured.
- add delete and save buttons to each image in the list
- click on delete will rename the file to deleted_filename and remove the image from the listing and moves to "removed" subfolder
- click on save will mark that this is already reviewed by renaming the file to saved_filename and moves to "saved" subfolder
- click on the name allows renaming the file

File naming: 
- will be talkative, 
- Will follow a syntax like here: "<status>-<TypeOfItem>-<Shape>-<YarnSize>-<YarnType>-<Colors>.png"
  Tex a hat that has been generated will get the name: Hat-PomPom-5-Merino-BlueYellow.png
  Same hat when saved: saved-Hat-PomPom-5-Merino-BlueYellow.png
  Same hat when deleted: deleted-Hat-PomPom-5-Merino-BlueYellow.png
  When I look at the image and see that it is actualy a Tam hat instead I will be able to rename to Hat-Tam-5-Merino-BlueYellow.png

Make sure to push and sync with me as you are ready so far. 

Next step: 

Search among all the none deleted files
- if I search Tam I will see all the Tam hats, If I search Blue I will see all the Blue hats, search on Tam Blue should give me all the Tam hats that are Blue.
- I need an endpoint for giving me the files on a single string input.
- I want the above admin interface to use that endpoint to list the files according to the search. 
