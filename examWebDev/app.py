from flask import Flask, render_template, request, session, redirect, url_for, flash
from flask_login import login_required, current_user
from mysql_db import MySQL
import mysql.connector as connector
from markdown import markdown as Markdown
from bleach import clean as bleach
import math

app = Flask(__name__)
application = app

app.config.from_pyfile('config.py')

mysql = MySQL(app)

from auth import bp as auth_bp , init_login_manager, check_rights


init_login_manager(app)
app.register_blueprint(auth_bp)

PER_PAGE = 10

def load_roles():
    cursor = mysql.connection.cursor(named_tuple=True)
    cursor.execute('SELECT id,name FROM exam_roles;')
    roles = cursor.fetchall()
    cursor.close()
    return roles

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/users')
def users():
    cursor = mysql.connection.cursor(named_tuple=True)
    cursor.execute('SELECT exam_users.*, exam_roles.name AS role_name FROM exam_users LEFT OUTER JOIN exam_roles ON exam_users.role_id = exam_roles.id;')
    users = cursor.fetchall()
    cursor.close()
    cur_us = current_user.get_id()
    print(users)
    return render_template('users/index.html', users=users, cur_us = cur_us)





""" -------------------------------------------------------------------------------------------------- """





def load_genres():
    cursor = mysql.connection.cursor(named_tuple=True)
    cursor.execute('SELECT * FROM exam_genres;')
    genres = cursor.fetchall()
    cursor.close()
    return genres


@app.route('/films')
def films():
    page = request.args.get('page', 1, type=int)
    with mysql.connection.cursor(named_tuple = True) as cursor:
        cursor.execute('SELECT count(*) AS count FROM visit_logs;')
        total_count = cursor.fetchone().count
    total_pages = math.ceil(total_count/PER_PAGE)
    pagination_info = {
        'current_page' : page,
        'total_pages' : total_pages,
        'per_page' : PER_PAGE
    }
    cursor = mysql.connection.cursor(named_tuple=True)
    query = """ SELECT * FROM (SELECT exam_film.id as id, name, year_w, 
    CASE WHEN count(opinion) IS NULL THEN 0 ELSE count(opinion) END as op_cnt FROM exam_film 
    LEFT JOIN exam_rec ON exam_film.id = exam_rec.film_id GROUP BY exam_film.id) op 
    INNER JOIN(SELECT exam_film.id as film_id, GROUP_CONCAT(name_genre) as genre_name FROM exam_film 
    INNER JOIN exam_genres_films ON exam_film.id = exam_genres_films.id_film GROUP BY exam_film.id) gen ON op.id = gen.film_id ORDER BY year_w DESC
    LIMIT %s OFFSET %s; """
    cursor.execute(query, (PER_PAGE, PER_PAGE*(page-1)))
    films = cursor.fetchall()
    user_id = current_user.get_id()
    cursor.execute('SELECT exam_users.*, exam_roles.name AS role_name FROM exam_users LEFT OUTER JOIN exam_roles ON exam_users.role_id = exam_roles.id HAVING exam_users.id = %s;', (user_id,))
    user = cursor.fetchone()
    cursor.close()
    print(users)
    print(user_id)
    return render_template('films/index.html', films=films, user=user, Markdown=Markdown, bleach=bleach, pagination_info=pagination_info)


@app.route('/films/new_film')
@check_rights('new')
@login_required
def new_film():
    return render_template('films/new_film.html', film={}, genres = load_genres())


@app.route('/films/create_film', methods=['POST'])
@check_rights('new')
@login_required
def create_film():
    name = request.form.get('name') or None
    """ image = request.form.get('image') or None """
    info = request.form.get('info') or None
    try:
        year_w = int(request.form.get('year_w')) or None
    except ValueError:
        year_w = None
    country = request.form.get('country') or None
    s_writer = request.form.get('s_writer') or None
    director = request.form.get('director') or None
    actors = request.form.get('actors') or None
    genre = request.form.getlist('genres') or None
    try:
        duration = int(request.form.get('duration')) or None 
    except ValueError:
        duration = None
    query = '''
        INSERT INTO exam_film (name, info, year_w, country, s_writer, director, actors, duration)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s);
    '''
    gen_query =''' 
        INSERT INTO exam_genres_films (name_genre, id_film)
        VALUES (%s,%s); 
    '''
    print(genre)
    if genre != None:
        genre_list = ', '.join(genre)
    else:
         genre_list = ''
    film = {
            'name' : name,
            'info' : info,
            'year_w' : year_w,
            'country' : country,
            's_writer' : s_writer,
            'director' : director,
            'actors' : actors,
            'duration' : duration,
            'genre' : genre_list
        }
    cursor = mysql.connection.cursor(named_tuple=True)
    try:
        cursor.execute(query, (name, info, year_w, country, s_writer, director, actors, duration,))
        id_film = cursor.lastrowid
        for gen in genre:
            try:
                cursor.execute(gen_query, (gen,id_film,))
            except connector.errors.DatabaseError as err:
                flash('Ошибка добавления жанра', 'danger')
                return render_template('films/new_film.html', film=film, genres = load_genres())
    except connector.errors.DatabaseError as err:
        flash('Введены некорректные данные. Ошибка сохранения.', 'danger')
        return render_template('films/new_film.html', film=film, genres = load_genres())
    mysql.connection.commit()
    cursor.close()
    flash(f'Фильм {name} был успешно добавлен','success')
    return redirect(url_for('films'))


@app.route('/films/<int:film_id>/edit_film')
@check_rights('edit')
@login_required
def edit_film(film_id):
    cursor = mysql.connection.cursor(named_tuple=True)
    cursor.execute(""" SELECT id, name, info, country, s_writer, director, actors, duration, year_w, 
    GROUP_CONCAT(name_genre) as genre FROM exam_film INNER JOIN exam_genres_films ON exam_film.id = exam_genres_films.id_film WHERE id =%s GROUP BY id; """, (film_id,))
    film = cursor.fetchone()
    cursor.close()
    return render_template('films/edit_film.html', film=film, genres = load_genres())


@app.route('/films/<int:film_id>/update_film', methods=['POST'])
@check_rights('edit')
@login_required
def update_film(film_id):
    name = request.form.get('name') or None
    """ image = request.form.get('image') or None """
    info = request.form.get('info') or None
    try:
        year_w = int(request.form.get('year_w')) or None
    except ValueError:
        year_w = None
    country = request.form.get('country') or None
    s_writer = request.form.get('s_writer') or None
    director = request.form.get('director') or None
    actors = request.form.get('actors') or None
    genre = request.form.getlist('genres') or 0
    try:
        duration = int(request.form.get('duration')) or None 
    except ValueError:
        duration = None
    query = '''
        UPDATE exam_film SET name=%s, info=%s, year_w=%s, country=%s, s_writer=%s, director=%s, actors=%s, duration=%s 
        WHERE id=%s;
    '''
    cursor = mysql.connection.cursor(named_tuple=True)
    try:
        cursor.execute(query, (name, info, year_w, country, s_writer, director, actors, duration, film_id,))
    except connector.errors.DatabaseError as err:
        flash('Введены некорректные данные. Ошибка сохранения.', 'danger')
        film = {
            'id' : film_id,
            'name' : name,
            'info' : info,
            'year_w' : year_w,
            'country' : country,
            's_writer' : s_writer,
            'director' : director,
            'actors' : actors,
            'duration' : duration,
            'genre' : ', '.join(genre)
        }
        return render_template('films/edit_film.html', film=film, genres = load_genres())
    cursor.execute('SELECT name_genre FROM exam_genres_films WHERE id_film=%s', (film_id,))
    rec_gen = cursor.fetchall()
    cursor.close()
    print(genre)
    append_gen = []
    delete_gen = []
    old_gen = []
    if genre != 0:
        for gen in rec_gen:
            old_gen.append(gen.name_genre)
            if gen.name_genre not in genre:
                delete_gen.append(gen.name_genre)
        for gen in genre:
            if gen not in old_gen:
                append_gen.append(gen)
                append_gen = list(set(append_gen))
    if len(append_gen) or len(delete_gen) > 0 and delete_gen != old_gen:
        cursor = mysql.connection.cursor(named_tuple=True)
        ins_query = '''
            INSERT INTO exam_genres_films (name_genre, id_film) VALUES (%s,%s);
        '''
        del_query = '''
            DELETE FROM exam_genres_films WHERE (name_genre=%s and id_film=%s);
        '''
        if len(append_gen) > 0:
            for gen in append_gen:
                cursor.execute(ins_query, (gen,film_id))
        if len(delete_gen) > 0:
            for gen in delete_gen:
                cursor.execute(del_query, (gen,film_id))
    cursor.close()
    mysql.connection.commit()
    flash(f'Фильм {name} был успешно изменён.','success')
    return redirect(url_for('films'))


@app.route('/films/<int:film_id>',  methods=['POST','GET'])
def show_film(film_id):
    user_id=current_user.get_id()
    cursor = mysql.connection.cursor(named_tuple=True)
    cursor.execute('SELECT * FROM exam_film WHERE id = %s;', (film_id,))
    film = cursor.fetchone()
    cursor.execute('SELECT GROUP_CONCAT(name_genre) as genre_name FROM exam_genres_films WHERE id_film=%s;', (film_id,))
    genres = cursor.fetchone()
    cursor.execute('SELECT exam_rec.*, exam_users.login FROM exam_rec INNER JOIN exam_users ON exam_rec.user_id = exam_users.id HAVING film_id = %s;', (film_id,))
    comments = cursor.fetchall()
    cursor.execute('SELECT * FROM exam_rec WHERE film_id = %s and user_id = %s', (film_id, user_id, ))
    check_com = cursor.fetchone()
    cursor.execute('SELECT * FROM exam_compilations WHERE user_id=%s;', (user_id,))
    compilations = cursor.fetchall()
    cursor.close()
    return render_template('films/show_film.html', film=film, genres=genres, comments=comments, check_com=check_com, compilations=compilations, Markdown=Markdown, bleach=bleach)


@app.route('/films/<int:film_id>/create_rec')
@login_required
def create_rec(film_id):
    return render_template('films/create_rec.html', film_id=film_id)


@app.route('/films/<int:film_id>/commit_rec', methods=['POST'])
@login_required
def commit_rec(film_id):
    opinion = request.form.get('rec') or None
    cnt = request.form.get('cnt') or None
    query ='''
        INSERT INTO exam_rec (film_id, user_id, cnt, opinion) VALUES (%s, %s, %s, %s);
    '''
    cursor = mysql.connection.cursor(named_tuple=True)
    user_id=current_user.get_id()
    try:
        cursor.execute(query, (film_id, user_id, cnt, opinion,))
        cursor.execute('SELECT * FROM exam_film WHERE id = %s;', (film_id,))
        film = cursor.fetchone()
        cursor.execute('SELECT GROUP_CONCAT(name_genre) as genre_name FROM exam_genres_films WHERE id_film=%s;', (film_id,))
        genres = cursor.fetchone()
        cursor.execute('SELECT exam_rec.*, exam_users.login FROM exam_rec INNER JOIN exam_users ON exam_rec.user_id = exam_users.id HAVING film_id = %s;', (film_id,))
        comments = cursor.fetchall()
        cursor.execute('SELECT * FROM exam_compilations WHERE user_id=%s;', (user_id,))
        compilations = cursor.fetchall()
        cursor.execute('SELECT * FROM exam_rec WHERE film_id = %s and user_id = %s', (film_id, user_id, ))
        check_com = cursor.fetchone()
    except connector.errors.DatabaseError as err:
        flash('Не удалось добавить комментарий','danger')
        return render_template('films/create_rec.html', film_id=film_id, user_id=user_id)
    cursor.close()
    mysql.connection.commit()
    flash('Комментарий успешно добавлен','success')
    return redirect(url_for('show_film', film_id=film_id, user_id=user_id))


@app.route('/films/<int:film_id>/delete', methods=['POST'])
@check_rights('delete')
@login_required
def delete_film(film_id):
    with mysql.connection.cursor(named_tuple=True) as cursor:
        try:
            cursor.execute('DELETE FROM exam_film WHERE id=%s;', (film_id,))
        except connector.errors.DatabaseError as err:
            flash('Не удалось удалить запись','danger')
            return redirect(url_for('films'))
        mysql.connection.commit()
        flash('Запись успешно удалена','success')
    return redirect(url_for('films'))


@app.route('/films/<int:film_id>/add_to_compilation', methods=['POST','GET'])
@login_required
def add_to_compilation(film_id):
    compilation_id = request.form.get('compilation_id')
    cursor = mysql.connection.cursor(named_tuple=True)
    try:
        cursor.execute('INSERT INTO exam_comp_films (id_film, id_comp) VALUES (%s,%s)', (film_id, compilation_id,))
    except connector.errors.DatabaseError as err:
        flash('Не удалось добавить фильм в подборку','danger')
        return redirect(url_for('show_film', film_id=film_id))
    mysql.connection.commit()
    flash('Фильм успешно добален в подборку','success')
    cursor.close()
    mysql.connection.commit()
    return redirect(url_for('show_film', film_id=film_id))


@app.route('/show_compilations/<int:compilation_id>/<int:film_id>/delete_from_compilation', methods=['POST','GET'])
@login_required
def delete_from_compilation(film_id, compilation_id):
    cursor = mysql.connection.cursor(named_tuple=True)
    try:
        cursor.execute('DELETE FROM exam_comp_films WHERE id_film=%s and id_comp=%s', (film_id, compilation_id,))
        cursor.execute(""" SELECT * FROM (SELECT exam_film.id as id, name, year_w, CASE WHEN count(opinion) IS NULL THEN 0 ELSE count(opinion) END as op_cnt FROM exam_film 
        LEFT JOIN exam_rec ON exam_film.id = exam_rec.film_id GROUP BY exam_film.id) op 
        INNER JOIN(SELECT exam_film.id as film_id, GROUP_CONCAT(name_genre) as genre_name FROM exam_film 
        INNER JOIN exam_genres_films ON exam_film.id = exam_genres_films.id_film GROUP BY exam_film.id) gen ON op.id = gen.film_id 
        INNER JOIN exam_comp_films ON gen.film_id = exam_comp_films.id_film WHERE exam_comp_films.id_comp = %s; """, (compilation_id,))
        films = cursor.fetchall()
    except connector.errors.DatabaseError as err:
        flash('Не удалось удалить фильм из подборки','danger')
        return redirect(url_for('show_compilation', compilation_id=compilation_id))
    mysql.connection.commit()
    flash('Фильм успешно удалён из подборки','success')
    cursor.close()
    mysql.connection.commit()
    return redirect(url_for('show_compilation', films=films, compilation_id=compilation_id))



@app.route('/films/show_compilations')
@login_required
def show_compilations():
    user_id = current_user.get_id()
    cursor = mysql.connection.cursor(named_tuple=True)
    cursor.execute(""" SELECT id, name, user_id, CASE WHEN count(id_film) is NULL THEN 0 ELSE COUNT(id_film) END as cnt FROM exam_compilations 
    LEFT JOIN exam_comp_films ON exam_compilations.id = exam_comp_films.id_comp WHERE user_id = %s GROUP BY id; """, (user_id,))
    compilations = cursor.fetchall()
    print(compilations)
    cursor.close()

    return render_template('films/show_compilations.html', compilations=compilations, user_id=user_id, Markdown=Markdown, bleach=bleach)


@app.route('/films/new_compilation')
@login_required
def new_compilation():
    user_id = current_user.id
    return render_template('films/new_compilation.html', user_id=user_id)


@app.route('/films/commit_compilation', methods=['POST'])
@login_required
def commit_compilation():
    user=current_user.id
    name = request.form.get('name-comp') or None
    query ='''
        INSERT INTO exam_compilations (name, user_id) VALUES (%s, %s);
    '''
    cursor = mysql.connection.cursor(named_tuple=True)
    user_id=current_user.get_id()
    try:
        cursor.execute(query, (name, user_id,))
        cursor = mysql.connection.cursor(named_tuple=True)
        cursor.execute(""" SELECT id, name, user_id, CASE WHEN count(id_film) is NULL THEN 0 ELSE COUNT(id_film) END as cnt FROM exam_compilations 
        LEFT JOIN exam_comp_films ON exam_compilations.id = exam_comp_films.id_comp WHERE user_id = %s GROUP BY id; """, (user_id,))
        compilations = cursor.fetchall()
    except connector.errors.DatabaseError as err:
        return render_template('films/new_compilation.html', user_id=user_id)
    cursor.close()
    mysql.connection.commit()
    return redirect('show_compilations')


@app.route('/films/show_compilations/<int:compilation_id>/delete_compilation', methods=['POST'])
@login_required
def delete_compilation(compilation_id):
    with mysql.connection.cursor(named_tuple=True) as cursor:
        try:
            cursor.execute('DELETE FROM exam_compilations WHERE id=%s;', (compilation_id,))
        except connector.errors.DatabaseError as err:
            flash('Не удалось удалить подборку','danger')
            return redirect(url_for('films'))
        mysql.connection.commit()
        flash('Подборка успешно удалена','success')
    return redirect(url_for('show_compilations'))


@app.route('/show_compilations/<int:compilation_id>', methods=['POST','GET'])
@login_required
def show_compilation(compilation_id):
    cursor = mysql.connection.cursor(named_tuple=True)
    cursor.execute(""" SELECT * FROM (SELECT exam_film.id as id, name, year_w, CASE WHEN count(opinion) IS NULL THEN 0 ELSE count(opinion) END as op_cnt FROM exam_film 
    LEFT JOIN exam_rec ON exam_film.id = exam_rec.film_id GROUP BY exam_film.id) op 
    INNER JOIN(SELECT exam_film.id as film_id, GROUP_CONCAT(name_genre) as genre_name FROM exam_film 
    INNER JOIN exam_genres_films ON exam_film.id = exam_genres_films.id_film GROUP BY exam_film.id) gen ON op.id = gen.film_id 
    INNER JOIN exam_comp_films ON gen.film_id = exam_comp_films.id_film WHERE exam_comp_films.id_comp = %s; """, (compilation_id,))
    films = cursor.fetchall()
    cursor.close()
    return render_template('films/show_compilation.html', films=films, compilation_id=compilation_id, Markdown=Markdown, bleach=bleach)
    


""" -------------------------------------------------------------------------------------------------- """


@app.route('/users/<int:user_id>')
@login_required
def show(user_id):
    cursor = mysql.connection.cursor(named_tuple=True)
    cursor.execute('SELECT * FROM exam_users WHERE id = %s;', (user_id,))
    user = cursor.fetchone()
    cursor.execute('SELECT * FROM exam_roles WHERE id=%s;', (user.role_id,))
    role = cursor.fetchone()
    cursor.close()

    return render_template('users/show.html', user=user, role=role)


if __name__ == "__main__":
    app.run(debug=True)
