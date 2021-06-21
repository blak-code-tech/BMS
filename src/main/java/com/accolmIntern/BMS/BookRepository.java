package com.accolmIntern.BMS;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Array;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Scanner;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

public class BookRepository {
	Connection con = null;
	PreparedStatement st = null;
	String message = "";
	String author = "";
	String title = "";
	float price = 0;
	Book book = null;
	ArrayList<Book> books = null;

	Logger logger = LogManager.getLogger(BookRepository.class);

	public List<Book> oldSearchBooks(String input) {
		logger.info("Starting book search");

		try {

			// Initialise the database
			logger.info("establishing connection to database...");
			con = DatabaseConnection.initializeDatabase();
			logger.info("Database connection established..");

			st = con.prepareStatement("select * from books where book_id like \"% " + input + "%\" or title like \"%"
					+ input + "%\" or author like \"%" + input + "%\" or price like \"%" + input + "%\";");
			logger.info("Preparing sql query");

			// to make changes in database
			logger.info("Executing sql query");
			st.execute();
			logger.info("Query executed..");

			logger.info("Fetching results..");
			ResultSet rs = st.getResultSet();
			logger.info("Results fetched successfully..");

			logger.info("Creating list..");
			books = new ArrayList<Book>();
			logger.info("List created..");

			logger.info("Adding results to list..");
			while (rs.next()) {

				Integer id = rs.getInt("book_id");
				title = rs.getString("title");
				author = rs.getString("author");
				price = rs.getFloat("price");

				book = new Book();
				book.setId(id);
				book.setAuthor(author);
				book.setTitle(title);
				book.setPrice(price);
				books.add(book);
			}
			logger.info("Results added successfully..");

		} catch (NumberFormatException e) {
			logger.error("Invalid input for price (numbers only).");
			message = "Invalid input for price (numbers only).";
		} catch (SQLException e) {
			logger.error("There is an error in your query. CHECK: /n" + e);
			message = "There is an error in your query. Report to the admininstrator./n " + e;
		} catch (Exception e) {
			logger.error(e.getMessage());
		} finally {

			try {
				if (message == "" || message == null) {
					if (books.size() == 0) {

						book = new Book();
						book.setId(0);
						books.add(book);
						logger.info("There no books to be added..\n" + "Completed ...\n\n");
					}

					return books;
				}

				// Close all the connections
				logger.error("Closing statement and connection");
				st.close();
				con.close();
				logger.error("Statement and connection closed successfully..");
			} catch (SQLException e) {
				logger.error("SQL not initialized. CHECK: /n" + e);
			} catch (Exception e) {
				logger.error(e.getMessage());
			}

		}

		return null;
	}

	public List<Book> searchBooks(String input) {
		logger.info("================================================================================");
		logger.info("Starting book search..");

		long start = System.currentTimeMillis();

		logger.info("Acquiring persistence context..");
		EntityManager em = LocalEntityManagerFactory.createEntityManager();
		logger.info("Persistence context acquired..");
		try {

			logger.info("Begining transaction..");
			em.getTransaction().begin();
			logger.info("Transaction begun..");

			logger.info("Processing query..");
			String query = "select b from Books b where b.id like \"% " + input + "%\" or b.title like \"%" + input
					+ "%\" or b.author like \"%" + input + "%\" or b.price like \"%" + input + "%\"";

			List<Book> bks = em.createQuery(query, Book.class).getResultList();

			logger.info("Processing completed..");

			logger.info("Commiting transaction..");
			em.getTransaction().commit();
			logger.info("Transaction commited..");

			if (bks.size() == 0) {

				book = new Book();
				book.setId(0);
				bks.add(book);
				logger.info("There no books to be added..\n" + "Completed");
			}

			return bks;

		} catch (IllegalArgumentException e) {
			logger.error("Error in query.. \nError Details: \n" + e);
		} catch (Exception e) {
			logger.error(e);
		} finally {
			logger.info("Closing persistence context..");
			em.close();
			logger.info("Closed persistence context..");
			logger.info("Getting data took " + (System.currentTimeMillis() - start) + "ms.");
			logger.info("================================================================================\n");
		}

		return null;
	}

	public List<Book> oldGetBooks() {
		logger.info("Starting get books..");

		try {

			// Initialise the database
			logger.info("establishing connection to database...");
			con = DatabaseConnection.initializeDatabase();
			logger.info("Database connection established..");

			st = con.prepareStatement("select * from books");
			logger.info("Preparing sql query");

			// to make changes in database logger.info("Executing sql query");
			st.execute();
			logger.info("Query executed..");

			logger.info("Fetching results..");
			ResultSet rs = st.getResultSet();
			logger.info("Results fetched successfully..");

			logger.info("Creating list..");
			books = new ArrayList<Book>();
			logger.info("List created..");

			logger.info("Adding results to list..");
			while (rs.next()) {

				int id = rs.getInt("book_id");
				title = rs.getString("title");
				author = rs.getString("author");
				price = rs.getFloat("price");

				book = new Book();
				book.setId(id);
				book.setAuthor(author);
				book.setTitle(title);
				book.setPrice(price);
				books.add(book);
			}
			logger.info("Results added successfully..");

		} catch (SQLException e) {
			logger.error("There is an error in your query. CHECK: /n" + e);
			message = "There is an error in your query. Report to the admininstrator./n " + e;
		} catch (Exception e) {
			logger.error(e.getMessage());
		} finally {

			try {
				if (message == "" || message == null) {

					return books;
				}

				// Close all the connections
				logger.error("Closing statement and connection");
				st.close();
				con.close();
				logger.error("Statement and connection closed successfully..");

			} catch (SQLException e) {
				logger.error("SQL not initialized. CHECK: /n" + e);
			} catch (Exception e) {
				logger.error(e.getMessage());
			}

		}

		return null;
	}

	public List<Book> getBooks(int page) {
		logger.info("================================================================================");
		logger.info("Starting get books..");

		long start = System.currentTimeMillis();

		logger.info("Acquiring persistence context..");
		EntityManager em = LocalEntityManagerFactory.createEntityManager();
		logger.info("Persistence context acquired..");
		try {

			logger.info("Begining transaction..");
			em.getTransaction().begin();
			logger.info("Transaction begun..");

			logger.info("Processing query..");

			Query query = em.createNativeQuery("SELECT * FROM Books ORDER BY book_id ASC LIMIT " + page + ",10;",
					Book.class);
			@SuppressWarnings("unchecked")
			List<Book> bks = query.getResultList();
			logger.info("Processing completed..");

			logger.info("Commiting transaction..");
			em.getTransaction().commit();
			logger.info("Transaction commited..");

			return bks;

		} catch (IllegalArgumentException e) {
			logger.error("Error in query.. \nError Details: \n" + e);
		} catch (Exception e) {
			logger.error(e);
		} finally {
			logger.info("Closing persistence context..");
			em.close();
			logger.info("Getting data took " + (System.currentTimeMillis() - start) + "ms.");
			logger.info("================================================================================   \n");
		}

		return null;
	}

	public int BooksCount() {
		logger.info("================================================================================");
		logger.info("Starting get books count..");

		long start = System.currentTimeMillis();

		logger.info("Acquiring persistence context..");
		EntityManager em = LocalEntityManagerFactory.createEntityManager();
		logger.info("Persistence context acquired..");
		try {

			logger.info("Begining transaction..");
			em.getTransaction().begin();
			logger.info("Transaction begun..");

			logger.info("Processing query..");

			Query query = em.createNativeQuery("SELECT * FROM Books", Book.class);
			@SuppressWarnings("unchecked")
			List<Book> bks = query.getResultList();
			int count = bks.size();
			logger.info("Processing completed..");

			logger.info("Commiting transaction..");
			em.getTransaction().commit();
			logger.info("Transaction commited..");

			return count;

		} catch (IllegalArgumentException e) {
			logger.error("Error in query.. \nError Details: \n" + e);
		} catch (Exception e) {
			logger.error(e);
		} finally {
			logger.info("Closing persistence context..");
			em.close();
			logger.info("Getting data took " + (System.currentTimeMillis() - start) + "ms.");
			logger.info("================================================================================\n");
		}

		return 0;
	}

	public Book oldGetBook(int id) {
		logger.info("Starting get book..");

		try {

			// Initialise the database
			logger.info("establishing connection to database...");
			con = DatabaseConnection.initializeDatabase();
			logger.info("Database connection established..");

			st = con.prepareStatement("select * from books where book_id=" + id);
			logger.info("Preparing sql query");

			// to make changes in database logger.info("Executing sql query");
			st.execute();
			logger.info("Query executed..");

			logger.info("Fetching results..");
			ResultSet rs = st.getResultSet();
			logger.info("Results fetched successfully..");

			rs.next();

			logger.info("Assigning fetched results properties to local properties..");
			title = rs.getString("title");
			author = rs.getString("author");
			price = rs.getFloat("price");

			logger.info("Create a new book instance");
			book = new Book();

			logger.info("Assingning local property values to the vook properties..");
			book.setId(id);
			book.setAuthor(author);
			book.setTitle(title);
			book.setPrice(price);

			logger.info("Assigned successfully..");
		} catch (SQLException e) {
			logger.error("There is an error in your query. CHECK: /n" + e);
			message = "There is an error in your query. Report to the admininstrator./n " + e;
		} catch (Exception e) {
			logger.error(e.getMessage());
		} finally {

			try {
				if (message == "" || message == null) {

					return book;
				}

				// Close all the connections
				logger.error("Closing statement and connection");
				st.close();
				con.close();
				logger.error("Statement and connection closed successfully..");
			} catch (SQLException e) {
				logger.error("There is an error in your connection. CHECK: /n" + e);
			} catch (Exception e) {
				logger.error(e.getMessage());
			}

		}

		return null;
	}

	public Book getBook(int id) {
		logger.info("================================================================================");
		logger.info("Starting get book..");

		long start = System.currentTimeMillis();

		logger.info("Acquiring persistence context..");
		EntityManager em = LocalEntityManagerFactory.createEntityManager();
		logger.info("Persistence context acquired..");
		try {
			logger.info("Finding book..");
			Book bk = em.find(Book.class, id);

			if (bk != null) {
				logger.info("Book with id: " + id + " acquired..");
				return bk;
			} else {
				logger.info("Book with id: " + id + " does not exist..");
			}

		} catch (IllegalArgumentException e) {
			logger.error("The id (" + id + ") those not exist. /nError In Details: /n" + e);
		} finally {
			logger.info("Closing persistence context..");
			em.close();
			logger.info("Getting data took " + (System.currentTimeMillis() - start) + "ms.");
			logger.info("================================================================================\n");
		}

		return null;
	}

	public String oldUpdateBook(Book book) {
		logger.info("Starting update books..");
		try {

			logger.info("Assigning parameter properties to local properties..");
			Integer id = (int) book.getId();
			String author = book.getAuthor();
			String title = book.getTitle();
			float price = book.getPrice();
			logger.info("Assigning completed..");

			// Initialise the database
			logger.info("establishing connection to database...");
			con = DatabaseConnection.initializeDatabase();
			logger.info("Database connection established..");

			st = con.prepareStatement("Update books set author=?,title=?,price=? where book_id=" + id);
			logger.info("Preparing sql query");

			// For the first parameter,
			// get the data using request object
			// sets the data to st pointer
			st.setString(1, author);

			// Same for second parameter
			st.setString(2, title);

			// Same for the third parameter
			st.setFloat(3, price);
			;
			logger.info("Executing sql query");
			st.executeUpdate();
			logger.info("Query executed..");

		} catch (NumberFormatException e) {
			logger.error("Invalid input for price (numbers only).");
			message = "Invalid input for price (numbers only).";
		} catch (SQLException e) {
			logger.error("There is an error in your query. CHECK: /n" + e);
			message = "There is an error in your query. Report to the admininstrator./n " + e;
		} catch (Exception e) {
			logger.error(e.getMessage());
		} finally {

			if (message == "" || message == null) {
				message = "ALLGOOD";
			}

			try {
				// Close all the connections
				logger.error("Closing statement and connection");
				st.close();
				con.close();
				logger.error("Statement and connection closed successfully..");
			} catch (SQLException e) {
				logger.error("There is an error in your connection. CHECK: /n" + e);
			} catch (Exception e) {
				logger.error(e.getMessage());
			}

		}

		return message;
	}

	public String updateBook(Book book) {
		logger.info("================================================================================");
		logger.info("Starting update book..");

		long start = System.currentTimeMillis();

		logger.info("Acquiring persistence context..");
		EntityManager em = LocalEntityManagerFactory.createEntityManager();
		logger.info("Persistence context acquired..");
		try {
			logger.info("Begining transaction..");
			em.getTransaction().begin();
			logger.info("Transaction begun..");

			logger.info("Searching for book with id: " + book.getId() + "..");
			Book bk = em.find(Book.class, book.getId());
			logger.info("Book found..");

			logger.info("Updating book..");
			bk.setAuthor(book.getAuthor());
			bk.setTitle(book.getTitle());
			bk.setPrice(book.getPrice());
			logger.info("Book Updated..");

			logger.info("Commiting transaction..");
			em.getTransaction().commit();
			logger.info("Transaction commited..");

			return "ALLGOOD";
		} catch (IllegalArgumentException e) {
			logger.error("The id (" + book.getId() + ") those not exist. \nError In Details: \n" + e);
		} catch (NullPointerException e) {
			logger.error("A null object has been passed. \nError In Details: \n" + e);
		} catch (Exception e) {
			logger.error(e);
		} finally {
			logger.info("Closing persistence context..");
			em.close();
			logger.info("Getting data took " + (System.currentTimeMillis() - start) + "ms.");
			logger.info("================================================================================\n");
		}

		return null;
	}

	public String oldDeleteBook(int id) {
		logger.info("Starting book book..");

		try {

			// Initialise the database
			logger.info("establishing connection to database...");
			con = DatabaseConnection.initializeDatabase();
			logger.info("Database connection established..");

			st = con.prepareStatement("DELETE FROM books WHERE book_id=" + id);
			logger.info("Preparing sql query");

			logger.info("Executing sql query");
			st.executeUpdate();
			logger.info("Query executed..");

		} catch (SQLException e) {
			logger.error("There is an error in your query. CHECK: /n" + e);
			message = "There is an error in your query. Report to the admininstrator./n " + e;
		} catch (Exception e) {
			logger.error(e.getMessage());
		} finally {

			if (message == "" || message == null) {
				message = "ALLGOOD";
			}

			try {
				// Close all the connections
				logger.error("Closing statement and connection");
				st.close();
				con.close();
				logger.error("Statement and connection closed successfully..");
			} catch (SQLException e) {
				logger.error("There is an error in your connection. CHECK: /n" + e);
			} catch (Exception e) {
				logger.error(e.getMessage());
			}

		}
		return message;
	}

	public String deleteBook(int id) {
		logger.info("================================================================================");
		logger.info("Starting delete book api..");

		long start = System.currentTimeMillis();

		logger.info("Acquiring persistence context..");
		EntityManager em = LocalEntityManagerFactory.createEntityManager();
		logger.info("Persistence context acquired..");

		try {

			logger.info("Begining transaction..");
			em.getTransaction().begin();
			logger.info("Transaction begun..");

			logger.info("Searching for book with id: " + id + "..");
			Book bk = em.find(Book.class, id);
			logger.info("Book found..");

			logger.info("Deleting book..");
			em.remove(bk);
			logger.info("Book deleted successfully..");

			logger.info("Commiting transaction..");
			em.getTransaction().commit();
			logger.info("Transaction commited..");

			return "ALLGOOD";
		} catch (IllegalArgumentException e) {
			logger.error("The id (" + book.getId() + ") those not exist. \nError In Details: \n" + e);
		} catch (NullPointerException e) {
			logger.error("A null object has been passed. \nError In Details: \n" + e);
		} catch (Exception e) {
			logger.error(e);
		} finally {
			logger.info("Closing persistence context..");
			em.close();
			logger.info("Getting data took " + (System.currentTimeMillis() - start) + "ms.");
			logger.info("================================================================================\n");
		}

		return null;
	}

	public String oldCreate(Book book) {
		logger.info("Adding a book..");
		try {

			logger.info("Assigning parameter properties to local properties..");
			author = book.getAuthor();
			title = book.getTitle();
			price = book.getPrice();
			logger.info("Assigning completed..");

			// Initialise the database
			logger.info("establishing connection to database...");
			con = DatabaseConnection.initializeDatabase();
			logger.info("Database connection established..");

			st = con.prepareStatement("insert into books (title, author, price) values(?, ?, ?)");
			logger.info("Preparing sql query");

			// For the first parameter, // get the data using request object // sets the
			st.setString(1, title);

			// Same for second parameter st.setString(2, author);

			// Same for the third parameter st.setFloat(3, price);

			logger.info("Executing sql query");
			st.executeUpdate();
			logger.info("Query executed..");

		} catch (NumberFormatException e) {
			logger.error("Invalid input for price (numbers only).");
			message = "Invalid input for price (numbers only).";
		} catch (SQLException e) {
			logger.error("There is an error in your query. CHECK: /n" + e);
			message = "There is an error in your query. Report to the admininstrator./n " + e;
		} catch (Exception e) {
			logger.error(e.getMessage());
		} finally {

			if (message == "" || message == null) {
				message = "ALLGOOD";
			}

			try { // Close all the connections
				logger.error("Closing statement and connection");
				st.close();
				con.close();
				logger.error("Statement and connection closed successfully..");
			} catch (SQLException e) {
				logger.error("There is an error in your connection. CHECK: /n" + e);
			} catch (Exception e) {
				logger.error(e.getMessage());
			}

		}

		return message;
	}

	public String create(Book book) {
		logger.info("================================================================================");
		logger.info("Starting add book..");

		long start = System.currentTimeMillis();

		logger.info("Acquiring persistence context..");
		EntityManager em = LocalEntityManagerFactory.createEntityManager();
		logger.info("Persistence context acquired..");

		try {

			logger.info("Begining transaction..");
			em.getTransaction().begin();
			logger.info("Transaction begun..");

			logger.info("Add book..");
			book = em.merge(book);
			logger.info("Book added successfully..");

			logger.info("Commiting transaction..");
			em.getTransaction().commit();
			logger.info("Transaction commited..");

			return "ALLGOOD";
		} catch (IllegalArgumentException e) {
			logger.error("The id (" + book.getId() + ") those not exist. \nError In Details: \n" + e);
		} catch (Exception e) {
			logger.error(e);
		} finally {
			logger.info("Closing persistence context..");
			em.close();
			logger.info("Getting data took " + (System.currentTimeMillis() - start) + "ms.");
			logger.info("================================================================================\n");
		}

		return null;
	}

	public String createFromList(Book[] books) {
		logger.info("================================================================================");
		logger.info("Starting add multiple books..");

		long start = System.currentTimeMillis();

		logger.info("Acquiring persistence context..");
		EntityManager em = LocalEntityManagerFactory.createEntityManager();
		logger.info("Persistence context acquired..");

		try {

			logger.info("Begining transaction..");
			em.getTransaction().begin();
			logger.info("Transaction begun..");

			logger.info("Adding books..");
			for (Book bk : books) {
				Book newBook = new Book();
				newBook.setAuthor(bk.getAuthor());
				newBook.setTitle(bk.getTitle());
				newBook.setPrice(bk.getPrice());
				book = em.merge(newBook);
			}

			logger.info("Books added successfully..");

			logger.info("Commiting transaction..");
			em.getTransaction().commit();
			logger.info("Transaction commited..");

			return "ALLGOOD";
		} catch (IllegalArgumentException e) {
			logger.error("The id (" + book.getId() + ") those not exist. \nError In Details: \n" + e);
		} catch (Exception e) {
			logger.error(e);
		} finally {
			logger.info("Closing persistence context..");
			em.close();
			logger.info("Getting data took " + (System.currentTimeMillis() - start) + "ms.");
			logger.info("================================================================================\n");
		}

		return null;
	}

	public String createByProcessing(InputStream inputStream, FormDataContentDisposition fileDetail) {

		logger.info("================================================================================");
		logger.info("Starting add multiple books..");

		long start = System.currentTimeMillis();

		logger.info("Acquiring persistence context..");
		EntityManager em = LocalEntityManagerFactory.createEntityManager();
		logger.info("Persistence context acquired..");

		try {

			logger.info("Begining transaction..");
			em.getTransaction().begin();
			logger.info("Transaction begun..");

			String fileName = fileDetail.getFileName();
			ArrayList<Book> myBooks;

			if (fileName.contains(".csv")) {
				// creating an InputStreamReader object
				InputStreamReader isReader = new InputStreamReader(inputStream);
				// Creating a BufferedReader object
				BufferedReader reader = new BufferedReader(isReader);
				String str;
				myBooks = new ArrayList<Book>();
				int count = 1;
				while ((str = reader.readLine()) != null) {
					if (count > 1) {
						Book book = new Book();
						String[] arrOfStr = str.split(",", 0);
						book.setAuthor(Array.get(arrOfStr, 0).toString());
						book.setTitle(Array.get(arrOfStr, 1).toString());
						book.setPrice(Float.parseFloat(Array.get(arrOfStr, 2).toString()));
						myBooks.add(book);
					}
					count++;
				}

				logger.info("Adding books..");
				for (Book newBook : myBooks) {
					book = em.merge(newBook);
				}
				logger.info("Books added successfully..");

			} else if (fileName.contains(".xlsx")) {
				XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
				XSSFSheet sheet = workbook.getSheetAt(0);
				Iterator<Row> row = sheet.iterator();
				int rowCount = 1;
				myBooks = new ArrayList<Book>();
				while (row.hasNext()) {
					Row ar = row.next();
					Iterator<Cell> cellIterator = ar.cellIterator();
					Book book = new Book();
					int cellCount = 1;
					while (cellIterator.hasNext()) {
						Cell cell = cellIterator.next();
						if (rowCount > 1) {
							if (cellCount == 1) {
								book.setAuthor(cell.toString());
							} else if (cellCount == 2) {
								book.setTitle(cell.toString());
							} else if (cellCount == 3) {
								book.setPrice(Float.parseFloat(cell.toString()));
								myBooks.add(book);
							}

						}
						cellCount++;
					}
					rowCount++;
				}

				logger.info("Adding books..");
				for (Book newBook : myBooks) {
					book = em.merge(newBook);
				}
				logger.info("Books added successfully..");

			} else if (fileName.contains(".xls")) {
				System.out.println("Excel file loaded with .xls ..");
			}

			logger.info("Commiting transaction..");
			em.getTransaction().commit();
			logger.info("Transaction commited..");

			return "ALLGOOD";
		} catch (

		IllegalArgumentException e) {
			logger.error("The id (" + book.getId() + ") those not exist. \nError In Details: \n" + e);
		} catch (Exception e) {
			logger.error(e);
		} finally {
			logger.info("Closing persistence context..");
			em.close();
			logger.info("Getting data took " + (System.currentTimeMillis() - start) + "ms.");
			logger.info("================================================================================\n");
		}

		return null;
	}

	public String showLogs() {
		
		String data = "";
		Scanner myReader = null;
		FileInputStream log = null;
		try {
			log = new FileInputStream("C:/Users/TT/Desktop/BMSLogs/BMS.log");
			myReader = new Scanner(log);
	        
			while (myReader.hasNextLine()) {
				data += myReader.nextLine() + "\n";
			}
			
			
		} catch (FileNotFoundException e) {
			System.out.println("An error occurred.");
			e.printStackTrace();
		}
		finally {
			try {
				log.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			myReader.close();
		}
		
		return data;
	}
}
