package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"

	"sync"
	"syscall"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

//"github.com/gorilla/handlers"
type myServer struct {
	http.Server
	shutdownReq chan bool
	reqCount    uint32
	WG          sync.WaitGroup
}
var Done chan bool
var Wg sync.WaitGroup

// NewServer - this is the init function for the server process
func NewServer(port string) *myServer {

	//create server - this version creates a server that listens on any address
	s := &myServer{
		Server: http.Server{
			Addr:         "localhost:" + port,
			ReadTimeout:  30 * time.Second,
			WriteTimeout: 30 * time.Second,
		},
		shutdownReq: make(chan bool),
	}

	router := mux.NewRouter()

	//register handlers
	router.HandleFunc("/calibrationprocessing", s.RootHandler)


	//pulse handlers - (there is currently no pulse module)
	// router.HandleFunc("/calibrationprocessing/V01/Pulse", pulse.PulseHandler)
	// router.HandleFunc("/calibrationprocessing/V01/Pulse/Logging", pulse.LoggingHandler)

	sh := http.StripPrefix("/portal/", http.FileServer(http.Dir("./portal/")))
	router.PathPrefix("/portal/").Handler(sh)

	th := http.StripPrefix("/portal2/", http.FileServer(http.Dir("./portal2/")))
	router.PathPrefix("/portal2/").Handler(th)
	// CORS stuff
	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "X-API-KEY", "X-Request-Token", "Content-Type"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"})
	s.Handler = handlers.CORS(headersOk, originsOk, methodsOk)(router)
	log.Println("Server started")
	return s
}

//WaitShutdown - for closing the server
func (s *myServer) WaitShutdown() {
	Done = make(chan bool)
	irqSig := make(chan os.Signal, 1)
	signal.Notify(irqSig, syscall.SIGINT, syscall.SIGTERM)

	//Wait interrupt or shutdown request through /shutdown
	select {
	case sig := <-irqSig:
		log.Printf("Shutdown request (signal: %v)", sig)
	case sig := <-s.shutdownReq:
		log.Printf("Shutdown request (/shutdown %v)", sig)
	}
	log.Printf("Stopping API server ...")
	close(Done)
	//Create shutdown context with 10 second timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	//shutdown the server
	err := s.Shutdown(ctx)
	if err != nil {
		log.Printf("Shutdown request error: %v", err)
	}
	log.Println("Waiting for waitgroup to clear")

	s.WG.Wait()

}

//RootHandler
func (s *myServer) RootHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Local Authority Data - see /calibrationprocessing/V01/swaggerui/ for documentation\n"))
}
