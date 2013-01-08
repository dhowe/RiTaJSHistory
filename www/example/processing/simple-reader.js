	int x=50,y=50,w=400,h=400;
	RText[] rts;
	String txt = "A huge lizard was discovered drinking out of the fountain today. It was not menacing anyone, it was just very thirsty. A small crowd gathered and whispered to one another, as though the lizard would understand them if they spoke in normal voices. The lizard seemed not even a little perturbed by their gathering. It drank and drank, its long forked tongue was like a red river hypnotizing the people, keeping them in a trance-like state. 'It's like a different town,' one of them whispered. 'Change is good,' the other one whispered back.";
	int[][] cells;
	
	void setup()
	{
		size(600, 800);
		
		RiText.defaultFont(createFont("Georgia", 16));
		txt += "</p>" + txt;   // add a paragraph
		
		rts = RiText.createLines(txt, x, y, w, h);
		layout(rts);
	}

	void draw() {
		background(255);
		noFill();
		rect(x, y, w, h);
		RiText.drawAll();
	}

	void layout(lines) {	
			
	    cells = new RiText[rts.length][];
	    for (int y = 0; y < rts.length; y++)
	    {
	      cells[y] = lines[y].splitWords();
	      RiText.dispose(lines[y]);
	    }
	    println(RiText.instances.length +" RiTexts created.");
	}
	
	void mouseMoved() {
		RiText.foreach(function(rt){ rt.fill(0); });
		var rt = contains(mouseX,mouseY);
		if (rt) rt.fill(200,0,0);
	}	

	RiText contains(float mx, float my)
	{
	  RiText[] rts = RiText.picked(mx, my);
	  return rts ? rts[0] : null;
	}
