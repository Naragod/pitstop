-- gets the max score of each course along with the name of the student who achieved this high score
select a.score, course.name, student.name from enrollment as a
join (
    select ecid, max(score) score
    from enrollment
    group by ecid
) as b on a.ecid = b.ecid and a.score = b.score
join student on sid = a.esid
join course on cid = a.ecid
order by a.score desc;

-- gets the max score of each student along with the name of the course this was achieved in
select a.score , student.name, course.name from enrollment as a
join (
    select esid, max(score) score
    from enrollment
    group by esid
) as b on a.esid = b.esid and a.score = b.score
join student on sid = a.esid
join course on cid = a.ecid
order by a.score desc;


-- There is no user input in these sql queries. No way to perform an sql attack.