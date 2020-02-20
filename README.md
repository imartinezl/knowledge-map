# knowledge-map

<img src="screenshot.jpg"/>


Mindmap of every concept, idea, technique, I had contact with, or interact in some way.
This could represent the concepts I can talk about, with less or more detail and competence.

Notes:
This is not a resource manager. It will only contain the name of the concepts.
Could be interesting to include tools related to those concepts, but I am not so sure about it
Cool options to have: interact with the mindmap on the web, and save different versions of the map on git for every change in the map, maybe?


Available tools for mindmap generation
https://mermaid-js.github.io/mermaid/#/

https://gojs.net/latest/index.html

https://github.com/jdebarochez/d3-mindmap

https://www.mindmeister.com/

http://freemind.sourceforge.net/wiki/index.php/Main_Page

https://www.mindjet.com/es/

https://github.com/learn-anything/react-mindmap

https://github.com/dundalek/markmap



## List of requirements for network

- High performance (fast rendering speed) vs More Built-ins interactions

|       |  SVG | Canvas | WebGL |
|:-----:|:----:|:------:|:-----:|
| Nodes |  500 |  5000  | 20000 |
| Edges | 1000 |  8000  | 30000 |
| Speed |   1  |    2   |   3   |
| Built-in Interactions| 3 | 2 | 1 |

- Search for nodes / edges
- Hide edges if not hovered
- Cluster nodes or group them based on a given category (activated by user zoom)

http://anvaka.github.io/graph-drawing-libraries/#!/all#%2Fall


- Data requirement:
    a) effort of manual labelling: community help
    b) automate from web sources: ontologies, knowledge and graph databases, wikipedia db, ...
- Define the objective of the knowledge graph / network:
    a) is it to provide a guideline of possible data science strategies to solve business problems
    b) to do a beautiful visualization of "the universe of data science", in the sense that thousands of nodes and edges are drawn, and its more of a visualization/representation of the literature?
