# GLOSKA — אתר אישי: אורן גלוסקא, מומחה סייבר ופרטיות מידע

אתר אינפורמטיבי סטטי, דו-לשוני (עברית RTL / אנגלית LTR), ללא תלויות build.

## מבנה הפרויקט

```
index.html        – העמוד (כל המדורים: Hero, נתונים, התמחויות, מתודולוגיה, אודות, יצירת קשר)
css/styles.css    – עיצוב (טוקנים, רספונסיביות, RTL/LTR)
js/i18n.js        – מילון התרגום עברית/אנגלית — כאן עורכים את כל הטקסטים
js/main.js        – החלפת שפה, תפריט מובייל, אנימציות, פורטרט
assets/logo.svg   – הלוגו (מגן + עץ, OG · SINCE 1977)
assets/portrait.jpg – (להוסיף) תמונת הפורטרט ל-Hero
```

## הפעלה מקומית

פשוט לפתוח את `index.html` בדפדפן, או:

```bash
python3 -m http.server 8080
# ואז http://localhost:8080
```

## החלפת שפה

- ברירת המחדל: עברית. כפתור `EN / עברית` בניווט מחליף שפה וכיוון עמוד.
- אפשר לקשר ישירות לשפה: `index.html?lang=en`.
- הבחירה נשמרת ב-localStorage.

## מה נשאר להשלים

1. **תמונת פורטרט** — לשים קובץ בשם `assets/portrait.jpg` (יחס 4:5 מומלץ). האתר יזהה אותו אוטומטית ויחליף את הלוגו.
2. **קורות חיים / פרופיל חברה (אופציונלי)** — להוסיף קובץ PDF ל-`assets/` ולקשר אליו כפתור משני ב-Hero.

## פריסה (Cloudflare Workers)

האתר מוגש מ-Cloudflare Worker בשם `gloska` (Static Assets), המחובר לריפו הזה:
כל push ל-`main` מפעיל build ו-deploy אוטומטיים.

- כתובת ייצור: https://gloska.co.il (וגם `www.gloska.co.il`)
- כתובת Worker: https://gloska.oren-00c.workers.dev
- הדומיין העברי `גלוסקא.ישראל` מפנה (301) ל-gloska.co.il דרך Redirect Rule ב-Cloudflare.
