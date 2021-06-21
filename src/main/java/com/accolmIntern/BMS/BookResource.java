package com.accolmIntern.BMS;

import java.io.InputStream;
import java.util.List;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("books")
public class BookResource {

	BookRepository repo = new BookRepository();

	@GET
	public int getCount() {

		return repo.BooksCount();
	}
	
	@GET
	@Path("logs")
	public String showLogs() {

		return repo.showLogs();
	}

	@GET
	@Path("{page}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Book> getBooks(@PathParam("page") int page) {

		return repo.getBooks(page);
	}

	@GET
	@Path("search/{input}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Book> searchBook(@PathParam("input") String input) {

		return repo.searchBooks(input);
	}

	@GET
	@Path("get/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Book getBook(@PathParam("id") int id) {
		return repo.getBook(id);
	}

	@DELETE
	@Path("delete/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String deleteBook(@PathParam("id") int id) {
		String res = repo.deleteBook(id);
		return res;
	}

	@PUT
	@Path("update")
	@Consumes(MediaType.APPLICATION_JSON)
	public String updateBook(Book book) {
		String res = repo.updateBook(book);
		return res;
	}

	@POST
	@Path("create")
	@Consumes(MediaType.APPLICATION_JSON)
	public String createBook(Book book) {
		String res = repo.create(book);
		return res;
	}

	@POST
	@Path("upload/csv")
	@Consumes(MediaType.APPLICATION_JSON)
	public String createBookWithUpload(Book[] books) {
		String res = repo.createFromList(books);
		return res;
	}
	
	// this is for UI processing..
	@POST
	@Path("upload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadFile(@FormDataParam("file") InputStream uploadedInputStream,
			@FormDataParam("file") FormDataContentDisposition fileDetail) {

		String res = repo.createByProcessing(uploadedInputStream, fileDetail);
		
		return Response.status(200).entity(res).build();
	}


}

