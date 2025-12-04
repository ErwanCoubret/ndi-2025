 1 from fastapi import FastAPI                                                                      
 2 from fastapi.middleware.cors import CORSMiddleware                                               
 3                                                                                                  
 4 app = FastAPI(title="Nuit de l'info 2025 - API")                                                 
 5                                                                                                  
 6 # Autoriser le front Next.js (http://localhost:3000)                                             
 7 origins = [                                                                                      
 8     "http://localhost:3001",                                                                     
 9 ]                                                                                                
10                                                                                                  
11 app.add_middleware(                                                                              
12     CORSMiddleware,                                                                              
13     allow_origins=origins,                                                                       
14     allow_credentials=True,                                                                      
15     allow_methods=["*"],                                                                         
16     allow_headers=["*"],                                                                         
17 )                                                                                                
18                                                                                                  
19                                                                                                  
20 @app.get("/api/health")                                                                          
21 def health_check():                                                                              
22     return {"status": "ok", "app": "Nuit de l'info 2025"}                                        
23                                                                                                  
24                                                                                                  
25 @app.get("/api/message")                                                                         
26 def get_message():                                                                               
27     return {"message": "Bienvenue sur la Nuit de l'info 2025 🎉"}  