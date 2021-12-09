package main

import (
	"log"
	"strings"
)

func main() {

	
	service := NewServer("8081")
	go func() {
		// This starts the HTTP server
		err := service.ListenAndServe()

		if err != nil {
			if strings.Contains(err.Error(), "Server closed") {
				log.Println("SyncTSD server closed")

			} else {
				log.Fatalln("Cannot Start Server, exiting:", err.Error())

			}
		}
	}()

	//Wait for shutdown
	service.WaitShutdown()

}
