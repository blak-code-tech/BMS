package com.accolmIntern.BMS;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class LocalEntityManagerFactory implements ServletContextListener {
	private static EntityManagerFactory emf;

	@Override
	public void contextInitialized(ServletContextEvent event) {
		emf = Persistence.createEntityManagerFactory("BooksUnit");
	}

	@Override
	public void contextDestroyed(ServletContextEvent event) {
		emf.close();
	}

	public static EntityManager createEntityManager() {
		if (emf == null) {
			throw new IllegalStateException("Context is not initialized yet.");
		}
		return emf.createEntityManager();
	}
}
