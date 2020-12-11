const path = require('path');
const express = require('express');
const exphbs  = require('express-handlebars');
const bodyparser= require('body-parser');
const session = require('express-session');
const cookieparser = require('cookie-parser');
const route = require('./routes');
const db = require('./config/db');
//apply

const app = express();
app.use(cookieparser('back-end-web-2020-vnua'));
db.connect();
app.use(express.static(path.join(__dirname, 'public')));

// handlebras&body-parser
app.engine('handlebars', exphbs({
    helpers: {
        sum: (a, b)=>a+b,
        admin: (name, color)=>{
            if (name === 'Admin'){
                let out = `<td class="text-warning">`;
                out = out +color;
                return out + `</td>`;
            }else {
                let out = `<td>`;
                out = out +color;
                return out+`</td>`;
            }
        },
        pagination: ( total,size,page ) =>{
            var pages = Math.ceil(total / size); 
            let out = `<ul class="pagination">
                            <li class="page-item">
                                <a class="page-link" href="?page=`+1+`">Trang đầu</a>
                            </li>
            `;
            for (var i = 1; i <= pages;i++){
                if (i == page){
                  out = out + `
               <li class="page-item active">
                    <a class="page-link" href ="?page=`+i+`">`+i+`</a>
               </li>
               `   }else{
                out = out + `
                <li class="page-item">
                     <a class="page-link" href ="?page=`+i+`">`+i+`</a>
                </li>
                `
               }
            }
                return out + `<li class="page-item">
                <a class="page-link" href="?page=`+pages+`">Trang cuối</a>
              </li>
            </ul>`;
        },
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.json());

//apply routes
route(app);
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));