CONF_FILE=.env

# 'private' task for echoing instructions
_pwd_prompt:
	@echo "Password needed to unlock settings.json"

# to create config/settings.json
decrypt_conf: _pwd_prompt
	openssl cast5-cbc -d -in ${CONF_FILE}.cast5 -out ${CONF_FILE}
	chmod 600 ${CONF_FILE}

# for updating config/settings.json
encrypt_conf: _pwd_prompt
	openssl cast5-cbc -e -in ${CONF_FILE} -out ${CONF_FILE}.cast5

.PHONY: _pwd_prompt decrypt_conf encrypt_conf
