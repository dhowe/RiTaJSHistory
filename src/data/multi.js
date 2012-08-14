grammar2 = {
	"<start>": 			"<noun-phrase> <verb-phrase>",
	"<noun-phrase>": 	"<determiner> <noun>",
	"<verb-phrase>": 	"<verb> | <verb> <noun-phrase> [.1]",
	"<determiner>":		"a [.1] | the",
	"<noun>":			"woman | man",
	"<verb>":			"shoots"
}


/*
# An Example CFG

######################################
# s   -> np vp
# np  -> det n
# vp  -> v | v np
# det -> 'a' | 'the'
# n   -> 'woman' | 'man'
# v   -> 'shoots'
######################################


{
  <start>
  <noun-phrase> <verb-phrase> 
}



{
  <noun-phrase>
  <determiner> <noun>
}

{
  <verb-phrase>
  <verb> | <verb> <noun-phrase> 
}

{
  <determiner>
  a | the 
}

{
  <noun>
  woman  |  man  
}

{
  <verb>
  shoots
}
*/