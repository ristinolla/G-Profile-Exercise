/**
* Modified by Perttu from https://github.com/googleplus/gplus-quickstart-java
**/

package com.perttu.gplus;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Scanner;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
* Initialize a session for the current user, and render index.html.
*/
public class MainServlet extends HttpServlet {


  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {
    // This check prevents the "/" handler from handling all requests by default
    if (!"/".equals(request.getServletPath())) {
      response.setStatus(HttpServletResponse.SC_NOT_FOUND);
      return;
    }
    
    response.setContentType("text/html");
    try {
      // Create a state token to prevent request forgery.
      // Store it in the session for later validation.
      String state = new BigInteger(130, new SecureRandom()).toString(32);
      request.getSession().setAttribute("state", state);

      // Fancy way to read index.html into memory, and set the client ID
      // and state values in the HTML before serving it.
      response.getWriter().print(new Scanner(new File("app.html"), "UTF-8")
          .useDelimiter("\\A").next()
          .replaceAll("[{]{2}\\s*CLIENT_ID\\s*[}]{2}", Utils.getClientID())
          .replaceAll("[{]{2}\\s*STATE\\s*[}]{2}", state)
          .replaceAll("[{]{2}\\s*APPLICATION_NAME\\s*[}]{2}",
              Utils.getApplicationName() )
          .toString());
      response.setStatus(HttpServletResponse.SC_OK);

    } catch (FileNotFoundException e) {
      // When running the quickstart, there was some path issue in finding
      // index.html.  Double check the quickstart guide.
      e.printStackTrace();
      response.setStatus(HttpServletResponse.SC_NOT_FOUND);
      response.getWriter().print(e.toString());
    }
  }
}
